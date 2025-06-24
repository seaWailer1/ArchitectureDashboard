'use client';

import { useQuery } from '@tanstack/react-query';
import { Layout, Typography, Button, Avatar, Badge, Select } from 'antd';
import { BellOutlined, DollarOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}

export default function AppHeader() {
  const { data: user } = useQuery<UserProfile>({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        return {
          id: 'dev-user-123',
          email: 'dev@example.com',
          firstName: 'Demo',
          lastName: 'User',
          language: 'en'
        };
      }
      return response.json();
    },
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <Header 
      style={{ 
        background: 'white', 
        borderBottom: '1px solid #f0f0f0',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        maxWidth: '448px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarOutlined style={{ color: 'white', fontSize: 16 }} />
          </div>
          <Text strong style={{ fontSize: 18 }}>AfriPay</Text>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Select
            value={user?.language || 'en'}
            size="small"
            style={{ width: 64 }}
            bordered={false}
            options={[
              { value: 'en', label: 'EN' },
              { value: 'fr', label: 'FR' },
              { value: 'ar', label: 'AR' },
              { value: 'sw', label: 'SW' }
            ]}
          />
          
          <Badge count={2} size="small">
            <Button 
              type="text" 
              icon={<BellOutlined />}
              style={{ color: '#6b7280' }}
            />
          </Badge>
          
          <Avatar 
            size={32}
            style={{ backgroundColor: '#3b82f6' }}
          >
            {getInitials(user?.firstName, user?.lastName)}
          </Avatar>
        </div>
      </div>
    </Header>
  );
}