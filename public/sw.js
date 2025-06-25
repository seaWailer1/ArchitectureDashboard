// Service Worker for AfriPay PWA
// Enables offline functionality and background sync

const CACHE_NAME = 'afripay-v1';
const OFFLINE_URL = '/offline';

// Assets to cache for offline use
const CACHE_ASSETS = [
  '/',
  '/offline',
  '/ussd',
  '/manifest.json',
  // Add other critical assets here
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses for offline viewing
          if (response.status === 200 && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response when offline
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline message for failed API requests
              return new Response(
                JSON.stringify({ 
                  error: 'Offline',
                  message: 'This feature requires internet connection',
                  cached: false
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle page requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Cache successful page responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for failed navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            throw new Error('Network request failed and no cache available');
          });
      })
  );
});

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-offline-transactions') {
    event.waitUntil(syncOfflineTransactions());
  }
});

// Handle message from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'QUEUE_TRANSACTION') {
    queueOfflineTransaction(event.data.transaction);
  }
});

// Queue offline transaction for background sync
function queueOfflineTransaction(transaction) {
  // Store transaction in IndexedDB for background sync
  const request = indexedDB.open('afripay-offline', 1);
  
  request.onsuccess = (event) => {
    const db = event.target.result;
    const txn = db.transaction(['transactions'], 'readwrite');
    const store = txn.objectStore('transactions');
    
    store.add({
      ...transaction,
      queuedAt: new Date().toISOString(),
      status: 'pending'
    });
    
    // Register for background sync
    self.registration.sync.register('sync-offline-transactions');
  };
  
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('transactions')) {
      const store = db.createObjectStore('transactions', { keyPath: 'id' });
      store.createIndex('status', 'status', { unique: false });
    }
  };
}

// Sync offline transactions when connection is restored
async function syncOfflineTransactions() {
  try {
    const db = await openIndexedDB();
    const transactions = await getOfflineTransactions(db);
    
    if (transactions.length === 0) {
      console.log('No offline transactions to sync');
      return;
    }
    
    console.log(`Syncing ${transactions.length} offline transactions`);
    
    const response = await fetch('/api/offline/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions })
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Update transaction statuses
      for (const syncResult of result.syncResults) {
        await updateTransactionStatus(db, syncResult.localId, syncResult.status);
      }
      
      console.log('Offline transactions synced successfully');
      
      // Notify all clients about successful sync
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          success: true,
          syncResults: result.syncResults
        });
      });
    }
  } catch (error) {
    console.error('Failed to sync offline transactions:', error);
    
    // Notify clients about sync failure
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        success: false,
        error: error.message
      });
    });
  }
}

// Helper functions for IndexedDB operations
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('afripay-offline', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
      }
    };
  });
}

function getOfflineTransactions(db) {
  return new Promise((resolve, reject) => {
    const txn = db.transaction(['transactions'], 'readonly');
    const store = txn.objectStore('transactions');
    const index = store.index('status');
    const request = index.getAll('pending');
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function updateTransactionStatus(db, transactionId, status) {
  return new Promise((resolve, reject) => {
    const txn = db.transaction(['transactions'], 'readwrite');
    const store = txn.objectStore('transactions');
    const request = store.get(transactionId);
    
    request.onsuccess = () => {
      const transaction = request.result;
      if (transaction) {
        transaction.status = status;
        transaction.syncedAt = new Date().toISOString();
        const updateRequest = store.put(transaction);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve(); // Transaction not found, but that's ok
      }
    };
    request.onerror = () => reject(request.error);
  });
}