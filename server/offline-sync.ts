import { Request, Response } from 'express';
import { storage } from './storage.js';

// Offline-first functionality for intermittent connectivity
// Handles transaction queuing and synchronization

interface OfflineTransaction {
  id: string;
  userId: string;
  type: 'send' | 'receive' | 'topup' | 'withdraw' | 'payment';
  amount: string;
  recipientId?: string;
  recipientPhone?: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  metadata?: any;
}

// Store for offline transactions (in production, use Redis or similar)
const offlineTransactionQueue: Map<string, OfflineTransaction[]> = new Map();

// Sync offline transactions when connectivity is restored
export async function syncOfflineTransactions(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { transactions } = req.body;
    
    if (!Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Invalid transactions data' });
    }

    const syncResults = [];
    
    for (const offlineTx of transactions) {
      try {
        const result = await processOfflineTransaction(userId, offlineTx);
        syncResults.push({
          localId: offlineTx.id,
          status: 'success',
          serverTransactionId: result.id,
          syncedAt: new Date().toISOString()
        });
      } catch (error) {
        syncResults.push({
          localId: offlineTx.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          retryAfter: Date.now() + (60000 * Math.pow(2, offlineTx.retryCount || 0)) // Exponential backoff
        });
      }
    }

    // Return balance updates and sync status
    const wallets = await storage.getUserWallets(userId);
    
    res.json({
      syncResults,
      wallets,
      syncedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync offline transactions error:', error);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
}

// Get offline-capable data for the user
export async function getOfflineData(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get essential data that should be available offline
    const [user, wallets, recentTransactions, contacts] = await Promise.all([
      storage.getUser(userId),
      storage.getUserWallets(userId),
      getRecentTransactionsForOffline(userId),
      getUserContactsForOffline(userId)
    ]);

    const offlineData = {
      user: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        currentRole: user?.currentRole,
        phoneNumber: user?.phoneNumber
      },
      wallets: wallets.map(wallet => ({
        id: wallet.id,
        walletType: wallet.walletType,
        balance: wallet.balance,
        currency: wallet.currency
      })),
      recentTransactions,
      contacts,
      lastSyncAt: new Date().toISOString(),
      capabilities: {
        canSendMoney: true,
        canReceiveMoney: true,
        canCheckBalance: true,
        canViewHistory: true,
        maxOfflineTransactionAmount: 1000,
        maxOfflineTransactions: 10
      }
    };

    res.json(offlineData);

  } catch (error) {
    console.error('Get offline data error:', error);
    res.status(500).json({ error: 'Failed to get offline data' });
  }
}

// Queue transaction for offline processing
export async function queueOfflineTransaction(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { transaction } = req.body;
    
    // Validate offline transaction
    const validationResult = validateOfflineTransaction(transaction);
    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.error });
    }

    // Create offline transaction record
    const offlineTransaction: OfflineTransaction = {
      id: transaction.id,
      userId,
      type: transaction.type,
      amount: transaction.amount,
      recipientId: transaction.recipientId,
      recipientPhone: transaction.recipientPhone,
      description: transaction.description,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
      metadata: transaction.metadata
    };

    // Store in queue
    const userQueue = offlineTransactionQueue.get(userId) || [];
    userQueue.push(offlineTransaction);
    offlineTransactionQueue.set(userId, userQueue);

    // Log offline transaction for monitoring
    await storage.logSecurityEvent({
      userId,
      eventType: 'offline_transaction_queued',
      severity: 'low',
      details: {
        transactionId: transaction.id,
        type: transaction.type,
        amount: transaction.amount
      },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    });

    res.json({
      success: true,
      queuedTransactionId: offlineTransaction.id,
      queuePosition: userQueue.length,
      estimatedSyncTime: new Date(Date.now() + 60000).toISOString()
    });

  } catch (error) {
    console.error('Queue offline transaction error:', error);
    res.status(500).json({ error: 'Failed to queue transaction' });
  }
}

// Check connectivity and sync status
export async function checkSyncStatus(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userQueue = offlineTransactionQueue.get(userId) || [];
    const pendingTransactions = userQueue.filter(tx => tx.status === 'pending');
    const failedTransactions = userQueue.filter(tx => tx.status === 'failed');

    res.json({
      isOnline: true,
      lastSyncAt: new Date().toISOString(),
      pendingTransactions: pendingTransactions.length,
      failedTransactions: failedTransactions.length,
      queuedTransactions: userQueue.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        timestamp: tx.timestamp,
        retryCount: tx.retryCount
      }))
    });

  } catch (error) {
    console.error('Check sync status error:', error);
    res.status(500).json({ error: 'Failed to check sync status' });
  }
}

// Process a single offline transaction
async function processOfflineTransaction(userId: string, offlineTransaction: OfflineTransaction) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const wallets = await storage.getUserWallets(userId);
  const primaryWallet = wallets.find(w => w.walletType === 'primary');
  
  if (!primaryWallet) {
    throw new Error('Primary wallet not found');
  }

  switch (offlineTransaction.type) {
    case 'send':
      return await processSendTransaction(primaryWallet, offlineTransaction);
    case 'receive':
      return await processReceiveTransaction(primaryWallet, offlineTransaction);
    case 'payment':
      return await processPaymentTransaction(primaryWallet, offlineTransaction);
    default:
      throw new Error(`Unsupported transaction type: ${offlineTransaction.type}`);
  }
}

// Process send money transaction
async function processSendTransaction(wallet: any, offlineTransaction: OfflineTransaction) {
  const amount = parseFloat(offlineTransaction.amount);
  const currentBalance = parseFloat(wallet.balance);
  
  if (currentBalance < amount) {
    throw new Error('Insufficient balance');
  }

  // Find recipient
  let recipientWallet;
  if (offlineTransaction.recipientId) {
    const recipientWallets = await storage.getUserWallets(offlineTransaction.recipientId);
    recipientWallet = recipientWallets.find(w => w.walletType === 'primary');
  } else if (offlineTransaction.recipientPhone) {
    // Lookup by phone number (simplified for demo)
    const recipient = await findUserByPhone(offlineTransaction.recipientPhone);
    if (recipient) {
      const recipientWallets = await storage.getUserWallets(recipient.id);
      recipientWallet = recipientWallets.find(w => w.walletType === 'primary');
    }
  }

  if (!recipientWallet) {
    throw new Error('Recipient wallet not found');
  }

  // Update balances
  await storage.updateWalletBalance(
    wallet.id,
    (currentBalance - amount).toString()
  );

  const recipientBalance = parseFloat(recipientWallet.balance);
  await storage.updateWalletBalance(
    recipientWallet.id,
    (recipientBalance + amount).toString()
  );

  // Create transaction record
  const transaction = await storage.createTransaction({
    fromWalletId: wallet.id,
    toWalletId: recipientWallet.id,
    amount: offlineTransaction.amount,
    type: 'send',
    status: 'completed',
    description: offlineTransaction.description,
    reference: `OFFLINE-${offlineTransaction.id}`,
    metadata: {
      ...offlineTransaction.metadata,
      syncedFromOffline: true,
      originalTimestamp: offlineTransaction.timestamp
    }
  });

  return transaction;
}

// Process receive money transaction
async function processReceiveTransaction(wallet: any, offlineTransaction: OfflineTransaction) {
  const amount = parseFloat(offlineTransaction.amount);
  const currentBalance = parseFloat(wallet.balance);

  // Update balance
  await storage.updateWalletBalance(
    wallet.id,
    (currentBalance + amount).toString()
  );

  // Create transaction record
  const transaction = await storage.createTransaction({
    toWalletId: wallet.id,
    amount: offlineTransaction.amount,
    type: 'receive',
    status: 'completed',
    description: offlineTransaction.description,
    reference: `OFFLINE-${offlineTransaction.id}`,
    metadata: {
      ...offlineTransaction.metadata,
      syncedFromOffline: true,
      originalTimestamp: offlineTransaction.timestamp
    }
  });

  return transaction;
}

// Process payment transaction
async function processPaymentTransaction(wallet: any, offlineTransaction: OfflineTransaction) {
  const amount = parseFloat(offlineTransaction.amount);
  const currentBalance = parseFloat(wallet.balance);
  
  if (currentBalance < amount) {
    throw new Error('Insufficient balance');
  }

  // Update balance
  await storage.updateWalletBalance(
    wallet.id,
    (currentBalance - amount).toString()
  );

  // Create transaction record
  const transaction = await storage.createTransaction({
    fromWalletId: wallet.id,
    amount: offlineTransaction.amount,
    type: 'payment',
    status: 'completed',
    description: offlineTransaction.description,
    reference: `OFFLINE-${offlineTransaction.id}`,
    metadata: {
      ...offlineTransaction.metadata,
      syncedFromOffline: true,
      originalTimestamp: offlineTransaction.timestamp
    }
  });

  return transaction;
}

// Validate offline transaction
function validateOfflineTransaction(transaction: any) {
  if (!transaction.id) {
    return { isValid: false, error: 'Transaction ID is required' };
  }

  if (!transaction.type || !['send', 'receive', 'payment'].includes(transaction.type)) {
    return { isValid: false, error: 'Invalid transaction type' };
  }

  const amount = parseFloat(transaction.amount);
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: 'Invalid amount' };
  }

  if (amount > 1000) {
    return { isValid: false, error: 'Amount exceeds offline transaction limit' };
  }

  if (!transaction.description) {
    return { isValid: false, error: 'Description is required' };
  }

  return { isValid: true };
}

// Helper functions
async function getRecentTransactionsForOffline(userId: string) {
  const wallets = await storage.getUserWallets(userId);
  const transactions = [];
  
  for (const wallet of wallets) {
    const walletTransactions = await storage.getTransactionsByWalletId(wallet.id, 10);
    transactions.push(...walletTransactions);
  }
  
  return transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);
}

async function getUserContactsForOffline(userId: string) {
  // Simplified contacts - in production this would be a proper contacts system
  return [
    { id: 'contact-1', name: 'Family Contact', phone: '+233241234567' },
    { id: 'contact-2', name: 'Business Contact', phone: '+233241234568' }
  ];
}

async function findUserByPhone(phoneNumber: string) {
  // Simplified phone lookup for demo
  const demoPhones = {
    '+233241234567': 'consumer-001',
    '+233241234568': 'merchant-001', 
    '+233241234569': 'agent-001'
  };
  
  const userId = demoPhones[phoneNumber as keyof typeof demoPhones];
  if (userId) {
    return await storage.getUser(userId);
  }
  
  return null;
}