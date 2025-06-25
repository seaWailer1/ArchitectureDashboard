'use client';

import { Card, Typography, Row, Col, Button, Space, QRCode } from 'antd';
import { CameraOutlined, QrcodeOutlined, SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';
import FeatureHints from '@/components/ui/feature-hints';

const { Title, Text } = Typography;

export default function QRPage() {
  const [activeTab, setActiveTab] = useState('scan');

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        <Title level={2} style={{ margin: '0 0 24px 0' }}>QR Payments</Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Card
              hoverable
              style={{ 
                height: '140px',
                textAlign: 'center',
                borderRadius: '12px'
              }}
              styles={{ 
                body: {
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }
              }}
            >
              <CameraOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px' }} />
              <Text strong>Scan QR Code</Text>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
                Scan to pay
              </Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              hoverable
              style={{ 
                height: '140px',
                textAlign: 'center',
                borderRadius: '12px'
              }}
              styles={{ 
                body: {
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }
              }}
            >
              <QrcodeOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
              <Text strong>Generate QR</Text>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
                Receive payments
              </Text>
            </Card>
          </Col>
        </Row>

        <Card title="How to use QR Payments">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>To Pay Someone:</Text>
              <Text style={{ display: 'block', color: '#666', fontSize: '14px' }}>
                1. Click "Scan QR Code" above
                <br />
                2. Point your camera at their QR code
                <br />
                3. Confirm the payment amount
                <br />
                4. Enter your PIN to complete
              </Text>
            </div>
            
            <div>
              <Text strong>To Receive Payment:</Text>
              <Text style={{ display: 'block', color: '#666', fontSize: '14px' }}>
                1. Click "Generate QR" above
                <br />
                2. Enter the amount you want to receive
                <br />
                3. Show the QR code to the payer
                <br />
                4. You'll receive confirmation when paid
              </Text>
            </div>
          </Space>
        </Card>

        <Card title="Recent QR Transactions" style={{ marginTop: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {[
              { type: 'received', amount: '50.00', from: 'John Doe', time: '2 mins ago' },
              { type: 'sent', amount: '25.50', to: 'Coffee Shop', time: '1 hour ago' },
              { type: 'received', amount: '100.00', from: 'Mary Smith', time: '2 hours ago' },
            ].map((transaction, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < 2 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div>
                  <Text strong>
                    {transaction.type === 'received' ? 'Received from' : 'Sent to'} {transaction.type === 'received' ? transaction.from : transaction.to}
                  </Text>
                  <Text style={{ display: 'block', color: '#666', fontSize: '12px' }}>
                    {transaction.time}
                  </Text>
                </div>
                <Text style={{ 
                  color: transaction.type === 'received' ? '#52c41a' : '#ff4d4f',
                  fontWeight: 'bold'
                }}>
                  {transaction.type === 'received' ? '+' : '-'}${transaction.amount}
                </Text>
              </div>
            ))}
          </Space>
        </Card>

        <Card title="Your Payment QR Code" style={{ marginTop: '16px' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <QRCode 
              value="afripay://pay/user123456?amount=0&currency=USD" 
              size={200}
              style={{ marginBottom: '16px' }}
            />
            <Text style={{ display: 'block', color: '#666', fontSize: '14px' }}>
              This QR code can be scanned to send you money
            </Text>
            <Button type="primary" style={{ marginTop: '16px' }}>
              Share QR Code
            </Button>
          </div>
        </Card>
      </main>

      <BottomNavigation currentPage="qr" />
      <FeatureHints />
    </div>
  );
}