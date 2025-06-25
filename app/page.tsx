'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Typography, Button, Space, Avatar, Row, Col, Statistic, Progress, Badge } from 'antd';
import { WalletOutlined, SendOutlined, ReceiveMoneyOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';

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
      const response = await fetch('/api/auth/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });

  const { data: wallets = [] } = useQuery<WalletData[]>({
    queryKey: ['/api/wallets'],
    queryFn: async () => {
      const response = await fetch('/api/wallets');
      if (!response.ok) throw new Error('Failed to fetch wallets');
      return response.json();
    },
  });

  const { data: transactions = [] } = useQuery<TransactionData[]>({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
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

        {/* Wallet Balance */}
        <Card className="mb-4">
          <Row align="middle" justify="space-between" className="mb-2">
            <Col>
              <Text type="secondary">Total Balance</Text>
            </Col>
            <Col>
              <Button 
                type="text" 
                icon={balanceVisible ? <WalletOutlined /> : <WalletOutlined />}
                onClick={() => setBalanceVisible(!balanceVisible)}
              />
            </Col>
          </Row>
          <Title level={2} style={{ margin: 0 }}>
            {balanceVisible ? `$${totalBalance.toFixed(2)}` : '****'}
          </Title>
          <Text type="secondary">
            {primaryWallet?.currency || 'USD'} • Primary Wallet
          </Text>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" className="mb-4">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Button 
                type="primary" 
                shape="circle" 
                size="large" 
                icon={<SendOutlined />}
                style={{ width: '100%', height: 56 }}
              />
              <Text className="block text-center mt-2 text-xs">Send</Text>
            </Col>
            <Col span={6}>
              <Button 
                type="default" 
                shape="circle" 
                size="large" 
                icon={<ReceiveMoneyOutlined />}
                style={{ width: '100%', height: 56 }}
              />
              <Text className="block text-center mt-2 text-xs">Receive</Text>
            </Col>
            <Col span={6}>
              <Button 
                type="default" 
                shape="circle" 
                size="large" 
                icon={<QrcodeOutlined />}
                style={{ width: '100%', height: 56 }}
              />
              <Text className="block text-center mt-2 text-xs">QR Pay</Text>
            </Col>
            <Col span={6}>
              <Button 
                type="default" 
                shape="circle" 
                size="large" 
                icon={<WalletOutlined />}
                style={{ width: '100%', height: 56 }}
              />
              <Text className="block text-center mt-2 text-xs">Wallets</Text>
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
    </div>
  );
}