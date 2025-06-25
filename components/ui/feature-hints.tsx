'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, FloatButton } from 'antd';
import { BulbOutlined, CloseOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface FeatureHint {
  id: string;
  title: string;
  description: string;
  page: string;
  userRole: string[];
  priority: 'high' | 'medium' | 'low';
  category: 'feature' | 'navigation' | 'action' | 'tip';
  actionText?: string;
}

interface FeatureHintsProps {
  currentPage: string;
  userRole: string;
  isFirstVisit?: boolean;
}

const FEATURE_HINTS: FeatureHint[] = [
  {
    id: 'home-quick-actions',
    title: 'Quick Actions',
    description: 'Access your most used features instantly with these quick action buttons.',
    page: 'home',
    userRole: ['consumer', 'merchant', 'agent'],
    priority: 'high',
    category: 'feature',
    actionText: 'Try it now'
  },
  {
    id: 'home-balance-toggle',
    title: 'Balance Privacy',
    description: 'Tap the eye icon to hide or show your balance for privacy.',
    page: 'home',
    userRole: ['consumer', 'merchant', 'agent'],
    priority: 'medium',
    category: 'tip'
  },
  {
    id: 'wallets-multi-currency',
    title: 'Multi-Currency Support',
    description: 'Your wallet supports multiple African currencies. Switch between them easily.',
    page: 'wallets',
    userRole: ['consumer', 'merchant'],
    priority: 'high',
    category: 'feature'
  },
  {
    id: 'services-mini-apps',
    title: 'Mini-Apps Ecosystem',
    description: 'Explore integrated services like loans, shopping, and bill payments.',
    page: 'services',
    userRole: ['consumer'],
    priority: 'high',
    category: 'navigation'
  }
];

export default function FeatureHints({ currentPage, userRole }: FeatureHintsProps) {
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const [activeHint, setActiveHint] = useState<FeatureHint | null>(null);
  const [showFloatButton, setShowFloatButton] = useState(false);

  // Load dismissed hints once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('afriPay-dismissed-hints');
      if (saved) {
        setDismissedHints(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load dismissed hints');
    }
    
    // Show float button after a delay
    const timer = setTimeout(() => setShowFloatButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Get current page hints
  const currentHints = FEATURE_HINTS.filter(hint => 
    hint.page === currentPage && 
    hint.userRole.includes(userRole) &&
    !dismissedHints.includes(hint.id)
  );

  // Show first available hint
  useEffect(() => {
    if (currentHints.length > 0 && !activeHint) {
      const timer = setTimeout(() => {
        setActiveHint(currentHints[0]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentHints, activeHint]);

  const dismissHint = (hintId: string) => {
    const newDismissed = [...dismissedHints, hintId];
    setDismissedHints(newDismissed);
    localStorage.setItem('afriPay-dismissed-hints', JSON.stringify(newDismissed));
    setActiveHint(null);
  };

  const showNextHint = () => {
    if (currentHints.length > 0) {
      setActiveHint(currentHints[0]);
    }
  };

  if (!activeHint && currentHints.length === 0) {
    return showFloatButton ? (
      <FloatButton
        icon={<BulbOutlined />}
        tooltip="No new hints available"
        style={{ right: 24, bottom: 80 }}
      />
    ) : null;
  }

  return (
    <>
      {activeHint && (
        <Card
          size="small"
          style={{
            position: 'fixed',
            top: 80,
            right: 16,
            width: 300,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #1890ff'
          }}
          actions={[
            <Button
              key="dismiss"
              type="text"
              size="small"
              onClick={() => dismissHint(activeHint.id)}
            >
              Got it
            </Button>
          ]}
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Space>
              <BulbOutlined style={{ color: '#1890ff' }} />
              <Title level={5} style={{ margin: 0, color: '#1890ff' }}>
                {activeHint.title}
              </Title>
              <Button 
                type="text" 
                size="small"
                icon={<CloseOutlined />}
                onClick={() => setActiveHint(null)}
                style={{ marginLeft: 'auto' }}
              />
            </Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {activeHint.description}
            </Text>
          </Space>
        </Card>
      )}

      {showFloatButton && currentHints.length > 0 && (
        <FloatButton
          icon={<BulbOutlined />}
          tooltip={`${currentHints.length} tip${currentHints.length > 1 ? 's' : ''} available`}
          onClick={showNextHint}
          style={{ right: 24, bottom: 80 }}
        />
      )}
    </>
  );
}