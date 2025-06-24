'use client';

import { Card, Typography, Avatar, Button, Row, Col, Divider, List } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';
import FeatureHints, { useFeatureHints } from '@/components/ui/feature-hints';

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

export default function ProfilePage() {
  const { isFirstVisit } = useFeatureHints('profile', 'consumer');
  
  const { data: user } = useQuery<UserProfile>({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        return {
          id: 'dev-user-123',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          currentRole: 'consumer',
          kycStatus: 'verified',
          phoneVerified: true,
          documentsVerified: true,
          biometricVerified: true
        };
      }
      return response.json();
    },
  });

  const profileActions = [
    { title: 'Account Settings', icon: <SettingOutlined />, description: 'Manage your account' },
    { title: 'Security', icon: <UserOutlined />, description: 'Privacy and security settings' },
    { title: 'Help & Support', icon: <UserOutlined />, description: 'Get help and support' },
    { title: 'Sign Out', icon: <LogoutOutlined />, description: 'Sign out of your account', danger: true }
  ];

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <main className="p-4 pb-20">
        {/* Profile Header */}
        <Card style={{ marginBottom: '16px' }}>
          <Row align="middle" gutter={16}>
            <Col>
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </Col>
            <Col flex={1}>
              <Title level={4} style={{ margin: 0 }}>
                {user?.firstName} {user?.lastName}
              </Title>
              <Text type="secondary">{user?.email}</Text>
              <br />
              <Text type="secondary">Role: {user?.currentRole}</Text>
            </Col>
            <Col>
              <Button icon={<EditOutlined />} type="text" />
            </Col>
          </Row>
        </Card>

        {/* KYC Status */}
        <Card title="Verification Status" style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 8]}>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  backgroundColor: user?.phoneVerified ? '#52c41a' : '#d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  📱
                </div>
                <Text style={{ fontSize: '12px' }}>Phone</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  backgroundColor: user?.documentsVerified ? '#52c41a' : '#d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  📄
                </div>
                <Text style={{ fontSize: '12px' }}>Documents</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  backgroundColor: user?.biometricVerified ? '#52c41a' : '#d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  👤
                </div>
                <Text style={{ fontSize: '12px' }}>Biometric</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Profile Actions */}
        <Card>
          <List
            dataSource={profileActions}
            renderItem={(item) => (
              <List.Item 
                style={{ 
                  padding: '12px 0',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (item.title === 'Sign Out') {
                    window.location.href = '/api/logout';
                  }
                }}
              >
                <List.Item.Meta
                  avatar={<div style={{ color: item.danger ? '#ff4d4f' : '#1890ff', fontSize: '18px' }}>{item.icon}</div>}
                  title={<span style={{ color: item.danger ? '#ff4d4f' : undefined }}>{item.title}</span>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </main>

      <BottomNavigation currentPage="profile" />
      
      {/* Feature Discovery Hints */}
      <FeatureHints 
        currentPage="profile" 
        userRole={user?.currentRole || 'consumer'}
        isFirstVisit={isFirstVisit}
      />
    </div>
  );
}