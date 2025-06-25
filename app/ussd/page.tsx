'use client';

import { Card, Typography, List, Space, Button, Input, Form } from 'antd';
import { PhoneOutlined, SendOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';

const { Title, Text, Paragraph } = Typography;

export default function USSDPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testUSSDCode = async (values: { phoneNumber: string; ussdCode: string }) => {
    setIsLoading(true);
    try {
      // Simulate USSD response for demo
      setTimeout(() => {
        setTestResult(`USSD Response for ${values.ussdCode}:\n\nCON Welcome to AfriPay\n1. Check Balance\n2. Send Money\n3. Buy Airtime\n4. Transaction History\n5. Account Settings\n6. Get Help`);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setTestResult('Error: USSD service unavailable');
      setIsLoading(false);
    }
  };

  const ussdCodes = [
    {
      code: '*544#',
      description: 'Main Menu - Access all AfriPay services',
      usage: 'Dial *544# and press call button'
    },
    {
      code: '*544*1#',
      description: 'Check Balance - View your current wallet balance',
      usage: 'Dial *544*1# for instant balance inquiry'
    },
    {
      code: '*544*2#',
      description: 'Send Money - Transfer money to another user',
      usage: 'Dial *544*2# and follow prompts'
    },
    {
      code: '*544*3#',
      description: 'Buy Airtime - Purchase mobile credit',
      usage: 'Dial *544*3# to buy airtime'
    },
    {
      code: '*544*4#',
      description: 'Transaction History - View recent transactions',
      usage: 'Dial *544*4# to see your last 5 transactions'
    }
  ];

  const languages = [
    { code: 'en', name: 'English', sample: 'CON Welcome to AfriPay\n1. Check Balance\n2. Send Money' },
    { code: 'fr', name: 'Français', sample: 'CON Bienvenue à AfriPay\n1. Vérifier Solde\n2. Envoyer Argent' },
    { code: 'ar', name: 'العربية', sample: 'CON مرحبا بكم في أفريباي\n1. فحص الرصيد\n2. إرسال المال' },
    { code: 'sw', name: 'Kiswahili', sample: 'CON Karibu AfriPay\n1. Angalia Mizani\n2. Tuma Pesa' }
  ];

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        <Title level={2} style={{ margin: '0 0 24px 0' }}>USSD Banking</Title>
        
        {/* Introduction */}
        <Card style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <PhoneOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <Title level={4} style={{ margin: 0 }}>Feature Phone Banking</Title>
            </Space>
            <Paragraph>
              Use AfriPay services on any mobile phone, including feature phones, 
              without internet connection. Simply dial our USSD codes to access 
              banking services anywhere in Africa.
            </Paragraph>
          </Space>
        </Card>

        {/* Available USSD Codes */}
        <Card title="Available USSD Codes" style={{ marginBottom: '16px' }}>
          <List
            dataSource={ussdCodes}
            renderItem={(item) => (
              <List.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      {item.code}
                    </Text>
                    <Button 
                      size="small" 
                      type="link"
                      href={`tel:${item.code.replace('#', '%23')}`}
                      icon={<PhoneOutlined />}
                    >
                      Dial
                    </Button>
                  </Space>
                  <div>
                    <Text strong>{item.description}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.usage}
                    </Text>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        {/* Language Support */}
        <Card title="Multi-Language Support" style={{ marginBottom: '16px' }}>
          <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
            AfriPay USSD works in multiple African languages:
          </Paragraph>
          
          <List
            dataSource={languages}
            renderItem={(lang) => (
              <List.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>{lang.name}</Text>
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: '8px', 
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    whiteSpace: 'pre-line'
                  }}>
                    {lang.sample}
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        {/* How to Use */}
        <Card title="How to Use USSD Banking" style={{ marginBottom: '16px' }}>
          <List
            dataSource={[
              {
                step: '1',
                instruction: 'Dial the USSD code',
                detail: 'On your phone keypad, dial *544# and press the call button'
              },
              {
                step: '2', 
                instruction: 'Follow the menu',
                detail: 'Select options by typing the number and pressing send/ok'
              },
              {
                step: '3',
                instruction: 'Enter required information',
                detail: 'Input phone numbers, amounts, or PIN when prompted'
              },
              {
                step: '4',
                instruction: 'Confirm transaction',
                detail: 'Review details and confirm with your 4-digit PIN'
              }
            ]}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#1890ff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <Text strong>{item.instruction}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.detail}
                    </Text>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        {/* USSD Simulator */}
        <Card title="USSD Simulator" style={{ marginBottom: '16px' }}>
          <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
            Test USSD codes in this simulator (for demonstration purposes):
          </Paragraph>
          
          <Form onFinish={testUSSDCode} layout="vertical">
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input 
                prefix={<PhoneOutlined />}
                placeholder="+233241234567"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item
              name="ussdCode"
              label="USSD Code"
              rules={[{ required: true, message: 'Please enter USSD code' }]}
            >
              <Input 
                placeholder="*544#"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={isLoading}
                icon={<SendOutlined />}
                style={{ width: '100%' }}
              >
                Test USSD Code
              </Button>
            </Form.Item>
          </Form>
          
          {testResult && (
            <div style={{ 
              marginTop: '16px',
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              whiteSpace: 'pre-line'
            }}>
              {testResult}
            </div>
          )}
        </Card>

        {/* Support Information */}
        <Card>
          <Space>
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
            <div>
              <Text strong>Need Help?</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                For USSD support, call +233-XXX-XXXX or visit your nearest AfriPay agent
              </Text>
            </div>
          </Space>
        </Card>
      </main>

      <BottomNavigation currentPage="ussd" />
    </div>
  );
}