'use client';

import { Layout, Button } from 'antd';
import { HomeOutlined, WalletOutlined, QrcodeOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const { Footer } = Layout;

interface BottomNavigationProps {
  currentPage?: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { path: '/', icon: HomeOutlined, label: 'Home', id: 'home' },
    { path: '/wallets', icon: WalletOutlined, label: 'Wallets', id: 'wallets' },
    { path: '/qr', icon: QrcodeOutlined, label: 'Pay', id: 'qr', special: true },
    { path: '/services', icon: AppstoreOutlined, label: 'Services', id: 'services' },
    { path: '/profile', icon: UserOutlined, label: 'Profile', id: 'profile' },
  ];

  const isActive = (path: string, id: string) => {
    if (currentPage) return currentPage === id;
    return pathname === path;
  };

  return (
    <Footer 
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #f0f0f0',
        padding: '8px 16px'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        maxWidth: '448px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.id);

          return (
            <Link key={item.id} href={item.path} passHref>
              <Button
                type="text"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 12px',
                  height: 'auto',
                  color: active ? '#3b82f6' : '#6b7280'
                }}
              >
              {item.special ? (
                <div style={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4
                }}>
                  <Icon style={{ color: 'white', fontSize: 16 }} />
                </div>
              ) : (
                <Icon 
                  style={{ 
                    fontSize: 20, 
                    marginBottom: 4,
                    color: active ? '#3b82f6' : '#6b7280'
                  }} 
                />
              )}
              <span style={{ 
                fontSize: 12, 
                fontWeight: 500,
                color: active ? '#3b82f6' : '#6b7280'
              }}>
                {item.label}
              </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </Footer>
  );
}