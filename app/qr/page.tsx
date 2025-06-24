'use client';

import { Card, Typography, Button, Row, Col, Space } from 'antd';
import { QrcodeOutlined, CameraOutlined } from '@ant-design/icons';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';
import FeatureHints, { useFeatureHints } from '@/components/ui/feature-hints';

const { Title, Text } = Typography;

export default function QRPage() {
  const { isFirstVisit } = useFeatureHints('qr', 'consumer');
  
  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        <Title level={2} style={{ margin: '0 0 24px 0' }}}>QR Payments</Title>
        
        {/* Quick Actions */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}}>
          <Col span={12}>
            <Card
              hoverable
              style={{ 
                height: '140px',
                textAlign: 'center',
                borderRadius: '12px'
              }}}
              styles={{ 
                body: {
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }
              }}}
            >
              <CameraOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px' }}} />
              <Text strong>Scan QR Code</Text>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}}>
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
              }}}
              styles={{ 
                body: {
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }
              }}}
            >
              <QrcodeOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }}} />
              <Text strong>Generate QR</Text>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}}>
                Receive payments
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Instructions */}
        <Card title="How to use QR Payments">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}}>
            <div>
              <Row align="middle" gutter={12}>
                <Col>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%',
                    backgroundColor: '#1890ff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}}>
                    1
                  </div>
                </Col>
                <Col flex={1}>
                  <Text strong>Scan to Pay</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '14px' }}}>
                    Use camera to scan merchant QR codes for instant payments
                  </Text>
                </Col>
              </Row>
            </div>

            <div>
              <Row align="middle" gutter={12}>
                <Col>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%',
                    backgroundColor: '#52c41a',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}}>
                    2
                  </div>
                </Col>
                <Col flex={1}>
                  <Text strong>Generate QR</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '14px' }}}>
                    Create your QR code to receive payments from others
                  </Text>
                </Col>
              </Row>
            </div>

            <div>
              <Row align="middle" gutter={12}>
                <Col>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%',
                    backgroundColor: '#fa8c16',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}}>
                    3
                  </div>
                </Col>
                <Col flex={1}>
                  <Text strong>Instant Transfer</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '14px' }}}>
                    Payments are processed instantly and securely
                  </Text>
                </Col>
              </Row>
            </div>
          </Space>
        </Card>
      </main>

      <BottomNavigation currentPage="qr" />
      
      {/* Feature Discovery Hints */}
      <FeatureHints 
        currentPage="qr" 
        userRole="consumer"
        isFirstVisit={isFirstVisit}
      />
    </div>
  );
}