'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button, List, Badge, Space, Spin, Alert } from 'antd';
import { 
  WifiOutlined, 
  CloudSyncOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';

const { Title, Text } = Typography;

interface OfflineTransaction {
  id: string;
  type: string;
  amount: string;
  status: 'pending' | 'synced' | 'failed';
  timestamp: string;
  retryCount: number;
}

interface SyncStatus {
  isOnline: boolean;
  lastSyncAt: string;
  pendingTransactions: number;
  failedTransactions: number;
  queuedTransactions: OfflineTransaction[];
}

export default function OfflinePage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkSyncStatus();
    const interval = setInterval(checkSyncStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/offline/status');
      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data);
      }
    } catch (error) {
      console.error('Failed to check sync status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncNow = async () => {
    setIsSyncing(true);
    try {
      // Get offline transactions from localStorage
      const offlineTransactions = JSON.parse(localStorage.getItem('offlineTransactions') || '[]');
      
      if (offlineTransactions.length > 0) {
        const response = await fetch('/api/offline/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactions: offlineTransactions })
        });
        
        if (response.ok) {
          const result = await response.json();
          
          // Update localStorage with sync results
          const updatedTransactions = offlineTransactions.map((tx: any) => {
            const syncResult = result.syncResults.find((r: any) => r.localId === tx.id);
            if (syncResult) {
              return {
                ...tx,
                status: syncResult.status === 'success' ? 'synced' : 'failed',
                serverTransactionId: syncResult.serverTransactionId,
                syncedAt: syncResult.syncedAt
              };
            }
            return tx;
          });
          
          localStorage.setItem('offlineTransactions', JSON.stringify(updatedTransactions));
          await checkSyncStatus();
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'synced':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'failed':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'synced':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-container">
        <AppHeader />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
        <BottomNavigation currentPage="offline" />
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        <Title level={2} style={{ margin: '0 0 24px 0' }}>Offline Mode</Title>
        
        {/* Connection Status */}
        <Card style={{ marginBottom: '16px' }}>
          <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <WifiOutlined 
                style={{ 
                  fontSize: '20px', 
                  color: syncStatus?.isOnline ? '#52c41a' : '#ff4d4f' 
                }} 
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {syncStatus?.isOnline ? 'Online' : 'Offline'}
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Last sync: {syncStatus?.lastSyncAt ? 
                    new Date(syncStatus.lastSyncAt).toLocaleString() : 'Never'}
                </Text>
              </div>
            </Space>
            
            <Button 
              type="primary"
              icon={<CloudSyncOutlined />}
              loading={isSyncing}
              onClick={syncNow}
              disabled={!syncStatus?.isOnline || syncStatus?.pendingTransactions === 0}
            >
              Sync Now
            </Button>
          </Space>
        </Card>

        {/* Sync Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
              {syncStatus?.pendingTransactions || 0}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Pending</Text>
          </Card>
          
          <Card size="small" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              {(syncStatus?.queuedTransactions || []).filter(tx => tx.status === 'synced').length}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Synced</Text>
          </Card>
          
          <Card size="small" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
              {syncStatus?.failedTransactions || 0}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Failed</Text>
          </Card>
        </div>

        {/* Offline Capabilities Info */}
        <Alert
          message="Offline Features Available"
          description="You can check balances, view transaction history, and queue transactions while offline. They will sync when connection is restored."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        {/* Queued Transactions */}
        <Card 
          title="Queued Transactions" 
          style={{ marginBottom: '16px' }}
          extra={
            <Badge 
              count={syncStatus?.queuedTransactions?.length || 0} 
              style={{ backgroundColor: '#1890ff' }} 
            />
          }
        >
          {syncStatus?.queuedTransactions && syncStatus.queuedTransactions.length > 0 ? (
            <List
              dataSource={syncStatus.queuedTransactions}
              renderItem={(transaction) => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                      {getStatusIcon(transaction.status)}
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {new Date(transaction.timestamp).toLocaleString()}
                        </Text>
                      </div>
                    </Space>
                    
                    <Space direction="vertical" align="end">
                      <div style={{ fontWeight: 'bold' }}>
                        ${transaction.amount}
                      </div>
                      <Badge 
                        status={getStatusColor(transaction.status) as any}
                        text={transaction.status}
                      />
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary" style={{ fontStyle: 'italic' }}>
              No queued transactions
            </Text>
          )}
        </Card>

        {/* Offline Tips */}
        <Card title="Offline Mode Tips">
          <List
            size="small"
            dataSource={[
              'Your balances and recent transactions are cached for offline viewing',
              'New transactions will be queued and processed when connection returns',
              'Maximum offline transaction amount is $1,000',
              'Up to 10 transactions can be queued offline',
              'Critical features like PIN changes require internet connection'
            ]}
            renderItem={(tip) => (
              <List.Item>
                <Text style={{ fontSize: '14px' }}>• {tip}</Text>
              </List.Item>
            )}
          />
        </Card>
      </main>

      <BottomNavigation currentPage="offline" />
    </div>
  );
}