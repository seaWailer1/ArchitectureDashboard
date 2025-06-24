'use client';

import { Card, Typography, Row, Col, Button, Space } from 'antd';
import { CarOutlined, ShoppingOutlined, ThunderboltOutlined, MobileOutlined, CreditCardOutlined, BankOutlined } from '@ant-design/icons';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';
import FeatureHints, { useFeatureHints } from '@/client/src/components/ui/feature-hints';

const { Title, Text } = Typography;

export default function ServicesPage() {
  const { isFirstVisit } = useFeatureHints('services', 'consumer');
  const services = [
    {
      id: 'transport',
      title: 'Transportation',
      description: 'Book rides and delivery',
      icon: <CarOutlined />,
      color: '#1890ff'
    },
    {
      id: 'shopping',
      title: 'Shopping',
      description: 'Buy products online',
      icon: <ShoppingOutlined />,
      color: '#52c41a'
    },
    {
      id: 'bills',
      title: 'Bill Payments',
      description: 'Pay utilities & bills',
      icon: <ThunderboltOutlined />,
      color: '#fa8c16'
    },
    {
      id: 'mobile',
      title: 'Mobile Top-up',
      description: 'Recharge your phone',
      icon: <MobileOutlined />,
      color: '#eb2f96'
    },
    {
      id: 'loans',
      title: 'Micro Loans',
      description: 'Quick loan application',
      icon: <CreditCardOutlined />,
      color: '#722ed1'
    },
    {
      id: 'banking',
      title: 'Banking',
      description: 'Account management',
      icon: <BankOutlined />,
      color: '#13c2c2'
    }
  ];

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        <Title level={2} style={{ margin: '0 0 24px 0' }}>Services</Title>
        
        <Row gutter={[16, 16]}>
          {services.map((service) => (
            <Col key={service.id} span={12}>
              <Card
                hoverable
                style={{ 
                  height: '120px',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                styles={{ 
                  body: {
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }
                }}
              >
                <div 
                  style={{ 
                    fontSize: '24px', 
                    color: service.color,
                    marginBottom: '8px'
                  }}
                >
                  {service.icon}
                </div>
                <Text strong style={{ textAlign: 'center', fontSize: '14px' }}>
                  {service.title}
                </Text>
                <Text 
                  type="secondary" 
                  style={{ 
                    textAlign: 'center', 
                    fontSize: '12px',
                    marginTop: '4px'
                  }}
                >
                  {service.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <Card 
          title="Quick Actions" 
          style={{ marginTop: '24px' }}
          styles={{ body: { padding: '16px' } }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button type="primary" block size="large">
              Transfer Money
            </Button>
            <Button block size="large">
              Request Payment
            </Button>
            <Button block size="large">
              Scan QR Code
            </Button>
          </Space>
        </Card>
      </main>

      <BottomNavigation currentPage="services" />
    </div>
  );
}