'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Typography, Button, Space, Avatar, Row, Col, Progress, Badge } from 'antd';
import { WalletOutlined, SendOutlined, DownloadOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AppHeader from '../components/layout/app-header';
import BottomNavigation from '../components/layout/bottom-navigation';
import FeatureHints from '../components/ui/feature-hints';

const { Title, Text } = Typography;

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  currentRole: string;
  kycStatus: string;
  phoneVerified: boolean;
  documentsVerified: boolean;
  biometricVerified: boolean;
}

interface WalletData {
  id: number;
  userId: string;
  walletType: string;
  balance: string;
  pendingBalance: string;
  currency: string;
}

interface TransactionData {
  id: number;
  type: string;
  amount: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function HomePage() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const { data: user } = useQuery<UserProfile>({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('API not available');
        }
        return response.json();
      } catch (error) {
        // Return demo data when API is not available
        return {
          id: 'dev-user-123',
          email: 'demo@afriPay.com',
          firstName: 'Demo',
          lastName: 'User',
          currentRole: 'consumer',
          kycStatus: 'verified',
          phoneVerified: true,
          documentsVerified: true,
          biometricVerified: true
        };
      }
    },
  });

  const { data: wallets = [] } = useQuery<WalletData[]>({
    queryKey: ['/api/wallets'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/wallets');
        if (!response.ok) throw new Error('API not available');
        return response.json();
      } catch (error) {
        return [{
          id: 1,
          userId: 'dev-user-123',
          walletType: 'primary',
          balance: '2850.75',
          pendingBalance: '150.00',
          currency: 'USD'
        }];
      }
    },
  });

  const { data: transactions = [] } = useQuery<TransactionData[]>({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('API not available');
        return response.json();
      } catch (error) {
        return [
          {
            id: 1,
            type: 'receive',
            amount: '850.00',
            status: 'completed',
            description: 'Freelance Payment',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            type: 'send',
            amount: '75.50',
            status: 'completed',
            description: 'Utility Bill',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 3,
            type: 'receive',
            amount: '200.00',
            status: 'pending',
            description: 'Refund Processing',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];
      }
    },
  });

  const primaryWallet = wallets.find(w => w.walletType === 'primary');
  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance || '0'), 0);

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'consumer':
        return 'Personal Banking';
      case 'merchant':
        return 'Business Account';
      case 'agent':
        return 'Agent Services';
      default:
        return 'User Account';
    }
  };

  const getKycProgress = () => {
    let progress = 0;
    if (user?.phoneVerified) progress += 33;
    if (user?.documentsVerified) progress += 33;
    if (user?.biometricVerified) progress += 34;
    return progress;
  };

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        {/* Welcome Section */}
        <Card className="mb-4 gradient-primary" style={{ color: 'white' }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Text style={{ color: 'white', opacity: 0.8 }}>Welcome back</Text>
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                {user?.firstName} {user?.lastName}
              </Title>
              <Text style={{ color: 'white', opacity: 0.9 }}>
                {getRoleDescription(user?.currentRole || '')}
              </Text>
            </Col>
            <Col>
              <Avatar 
                size={48} 
                icon={<UserOutlined />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </Col>
          </Row>
        </Card>

        {/* Enhanced Balance Card */}
        <Card 
          className="mb-4 bg-gradient-primary shadow-custom"
          styles={{
            body: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '12px'
            }
          }}
        >
          <Row align="middle" justify="space-between" className="mb-3">
            <Col>
              <Text style={{ color: 'white', opacity: 0.9, fontSize: '14px' }}>
                Total Balance
              </Text>
            </Col>
            <Col>
              <Button 
                type="text" 
                size="small"
                onClick={() => setBalanceVisible(!balanceVisible)}
                style={{ color: 'white' }}
                className="hover:bg-white hover:bg-opacity-20"
              >
                {balanceVisible ? '👁️' : '👁️‍🗨️'}
              </Button>
            </Col>
          </Row>
          <Title level={1} style={{ color: 'white', margin: '8px 0', fontWeight: 'bold' }}>
            {balanceVisible ? `$${totalBalance.toFixed(2)}` : '••••••'}
          </Title>
          <div className="flex justify-between items-center">
            <Text style={{ color: 'white', opacity: 0.8, fontSize: '13px' }}>
              {primaryWallet?.currency || 'USD'} • Primary Wallet
            </Text>
            <Badge 
              count="Active" 
              style={{ 
                backgroundColor: '#52c41a',
                fontSize: '10px',
                height: '18px',
                lineHeight: '18px'
              }}
            />
          </div>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card 
          title={
            <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
              Quick Actions
            </Title>
          } 
          className="mb-4 shadow-sm"
          styles={{ body: { padding: '16px' } }}
        >
          <Row gutter={[12, 16]}>
            <Col span={6}>
              <div className="text-center">
                <Button 
                  type="primary" 
                  shape="circle" 
                  size="large" 
                  icon={<SendOutlined />}
                  className="shadow-md hover:shadow-lg transition-all duration-200"
                  style={{ 
                    width: 56, 
                    height: 56,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                />
                <Text className="block mt-2 text-xs font-medium text-gray-600">Send</Text>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <Button 
                  shape="circle" 
                  size="large" 
                  icon={<DownloadOutlined />}
                  className="shadow-md hover:shadow-lg transition-all duration-200 hover:bg-green-50"
                  style={{ 
                    width: 56, 
                    height: 56,
                    borderColor: '#10b981',
                    color: '#10b981'
                  }}
                />
                <Text className="block mt-2 text-xs font-medium text-gray-600">Receive</Text>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <Button 
                  shape="circle" 
                  size="large" 
                  icon={<QrcodeOutlined />}
                  className="shadow-md hover:shadow-lg transition-all duration-200 hover:bg-purple-50"
                  style={{ 
                    width: 56, 
                    height: 56,
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6'
                  }}
                />
                <Text className="block mt-2 text-xs font-medium text-gray-600">QR Pay</Text>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center">
                <Button 
                  shape="circle" 
                  size="large" 
                  icon={<WalletOutlined />}
                  className="shadow-md hover:shadow-lg transition-all duration-200 hover:bg-blue-50"
                  style={{ 
                    width: 56, 
                    height: 56,
                    borderColor: '#3b82f6',
                    color: '#3b82f6'
                  }}
                />
                <Text className="block mt-2 text-xs font-medium text-gray-600">Wallets</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* KYC Status */}
        {user?.kycStatus !== 'verified' && (
          <Card className="mb-4">
            <Title level={5}>Complete Your Profile</Title>
            <Progress 
              percent={getKycProgress()} 
              strokeColor="#3b82f6"
              className="mb-2"
            />
            <Text type="secondary">
              {getKycProgress()}% complete • Complete KYC to unlock all features
            </Text>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          <Space direction="vertical" style={{ width: '100%' }}>
            {transactions.slice(0, 5).map((transaction) => (
              <Row key={transaction.id} align="middle" justify="space-between">
                <Col>
                  <Text strong>{transaction.description}</Text>
                  <Text type="secondary" className="block text-xs">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </Text>
                </Col>
                <Col>
                  <Text 
                    type={transaction.type === 'receive' ? 'success' : undefined}
                    strong
                  >
                    {transaction.type === 'receive' ? '+' : '-'}${transaction.amount}
                  </Text>
                  <Badge 
                    status={transaction.status === 'completed' ? 'success' : 'processing'}
                    className="ml-2"
                  />
                </Col>
              </Row>
            ))}
            {transactions.length === 0 && (
              <Text type="secondary" className="text-center block">
                No transactions yet
              </Text>
            )}
          </Space>
        </Card>
      </main>

      <BottomNavigation currentPage="home" />
      
      {/* Feature Discovery Hints */}
      <FeatureHints 
        currentPage="home" 
        userRole={user?.currentRole || 'consumer'}
        isFirstVisit={true}
      />
    </div>
  );
}