'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Typography, Button, Row, Col, Statistic, Progress, Switch, Tabs, Badge, Space } from 'antd';
import { WalletOutlined, EyeOutlined, EyeInvisibleOutlined, SendOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';
import FeatureHints, { useFeatureHints } from '@/client/src/components/ui/feature-hints';

const { Title, Text } = Typography;

interface WalletData {
  id: number;
  userId: string;
  walletType: string;
  balance: string;
  pendingBalance: string;
  currency: string;
}

export default function WalletsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('primary');

  const { data: wallets = [] } = useQuery<WalletData[]>({
    queryKey: ['/api/wallets'],
    queryFn: async () => {
      const response = await fetch('/api/wallets');
      if (!response.ok) {
        return [
          {
            id: 1,
            userId: 'dev-user-123',
            walletType: 'primary',
            balance: '2500.00',
            pendingBalance: '0.00',
            currency: 'USD'
          },
          {
            id: 2,
            userId: 'dev-user-123',
            walletType: 'savings',
            balance: '5000.00',
            pendingBalance: '0.00',
            currency: 'USD'
          }
        ];
      }
      return response.json();
    },
  });

  const getWalletsByType = (type: string) => {
    return wallets.filter(w => w.walletType === type);
  };

  const getTotalBalance = () => {
    return wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance || '0'), 0);
  };

  const getWalletTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto':
        return '₿';
      case 'savings':
        return '🏦';
      case 'investment':
        return '📈';
      default:
        return '💳';
    }
  };

  const items = [
    {
      key: 'primary',
      label: 'Primary',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          {getWalletsByType('primary').map(wallet => (
            <Card key={wallet.id} className="mb-4">
              <Row align="middle" justify="space-between">
                <Col>
                  <Text type="secondary">Available Balance</Text>
                  <Title level={3} style={{ margin: '8px 0' }}>
                    {balanceVisible ? `$${parseFloat(wallet.balance).toFixed(2)}` : '****'}
                  </Title>
                  <Text type="secondary">{wallet.currency}</Text>
                </Col>
                <Col>
                  <div style={{ fontSize: 32 }}>💳</div>
                </Col>
              </Row>
              <Row gutter={8} style={{ marginTop: 16 }}>
                <Col span={8}>
                  <Button type="primary" block icon={<SendOutlined />}>
                    Send
                  </Button>
                </Col>
                <Col span={8}>
                  <Button block icon={<DownloadOutlined />}>
                    Receive
                  </Button>
                </Col>
                <Col span={8}>
                  <Button block icon={<PlusOutlined />}>
                    Top Up
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      ),
    },
    {
      key: 'crypto',
      label: 'Crypto',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          {getWalletsByType('crypto').map(wallet => (
            <Card key={wallet.id} className="mb-4">
              <Row align="middle" justify="space-between">
                <Col>
                  <Text type="secondary">Crypto Balance</Text>
                  <Title level={3} style={{ margin: '8px 0' }}>
                    {balanceVisible ? `$${parseFloat(wallet.balance).toFixed(2)}` : '****'}
                  </Title>
                  <Badge status="success" text="Active" />
                </Col>
                <Col>
                  <div style={{ fontSize: 32 }}>₿</div>
                </Col>
              </Row>
            </Card>
          ))}
          {getWalletsByType('crypto').length === 0 && (
            <Card>
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>₿</div>
                <Title level={4}>No Crypto Wallets</Title>
                <Text type="secondary">Create your first crypto wallet to get started</Text>
                <br />
                <Button type="primary" style={{ marginTop: 16 }}>
                  Create Crypto Wallet
                </Button>
              </div>
            </Card>
          )}
        </Space>
      ),
    },
    {
      key: 'savings',
      label: 'Savings',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          {getWalletsByType('savings').map(wallet => (
            <Card key={wallet.id} className="mb-4">
              <Row align="middle" justify="space-between">
                <Col>
                  <Text type="secondary">Savings Balance</Text>
                  <Title level={3} style={{ margin: '8px 0' }}>
                    {balanceVisible ? `$${parseFloat(wallet.balance).toFixed(2)}` : '****'}
                  </Title>
                  <Text type="secondary">2.5% APY</Text>
                </Col>
                <Col>
                  <div style={{ fontSize: 32 }}>🏦</div>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      ),
    },
    {
      key: 'investment',
      label: 'Investment',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          {getWalletsByType('investment').map(wallet => (
            <Card key={wallet.id} className="mb-4">
              <Row align="middle" justify="space-between">
                <Col>
                  <Text type="secondary">Investment Balance</Text>
                  <Title level={3} style={{ margin: '8px 0' }}>
                    {balanceVisible ? `$${parseFloat(wallet.balance).toFixed(2)}` : '****'}
                  </Title>
                  <Text type="success">+12.5% YTD</Text>
                </Col>
                <Col>
                  <div style={{ fontSize: 32 }}>📈</div>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        {/* Header with Balance Toggle */}
        <Row align="middle" justify="space-between" className="mb-4">
          <Col>
            <Title level={2} style={{ margin: 0 }}>Wallets</Title>
          </Col>
          <Col>
            <Space>
              <Text type="secondary">Balance</Text>
              <Switch
                checked={balanceVisible}
                onChange={setBalanceVisible}
                checkedChildren={<EyeOutlined />}
                unCheckedChildren={<EyeInvisibleOutlined />}
              />
            </Space>
          </Col>
        </Row>

        {/* Total Portfolio Summary */}
        <Card className="mb-4 gradient-primary" style={{ color: 'white' }}>
          <Text style={{ color: 'white', opacity: 0.8 }}>Total Portfolio</Text>
          <Title level={2} style={{ color: 'white', margin: '8px 0 0 0' }}>
            {balanceVisible ? `$${getTotalBalance().toFixed(2)}` : '****'}
          </Title>
          <Text style={{ color: 'white', opacity: 0.9 }}>
            All Wallets Combined
          </Text>
        </Card>

        {/* Wallet Type Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          tabBarStyle={{ marginBottom: 16 }}
        />
      </main>

      <BottomNavigation currentPage="wallets" />
    </div>
  );
}