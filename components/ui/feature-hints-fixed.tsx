'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Button, Space, Typography, Popover, Badge, FloatButton } from 'antd';
import { BulbOutlined, CloseOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface FeatureHint {
  id: string;
  title: string;
  description: string;
  page: string;
  userRole: string[];
  priority: 'high' | 'medium' | 'low';
  category: 'feature' | 'navigation' | 'action' | 'tip';
  element?: string;
  trigger: 'page_load' | 'idle' | 'first_visit' | 'interaction';
  icon?: string;
  actionText?: string;
  actionUrl?: string;
}

interface FeatureHintsProps {
  currentPage: string;
  userRole: string;
  isFirstVisit?: boolean;
}

const FEATURE_HINTS: FeatureHint[] = [
  // Home Page Hints
  {
    id: 'home-quick-send',
    title: 'Quick Send Money',
    description: 'Tap the Send button to instantly transfer money to contacts or scan QR codes for payments.',
    page: 'home',
    userRole: ['consumer', 'merchant', 'agent'],
    priority: 'high',
    category: 'action',
    trigger: 'first_visit',
    actionText: 'Try it now',
    actionUrl: '/send'
  },
  {
    id: 'home-balance-visibility',
    title: 'Toggle Balance Visibility',
    description: 'Tap the eye icon to hide/show your balance for privacy in public spaces.',
    page: 'home',
    userRole: ['consumer', 'merchant', 'agent'],
    priority: 'medium',
    category: 'tip',
    trigger: 'page_load'
  },
  {
    id: 'home-wallet-overview',
    title: 'Multiple Wallets',
    description: 'You can manage different wallet types: Primary for daily use, Savings for goals, Crypto for digital assets.',
    page: 'home',
    userRole: ['consumer'],
    priority: 'medium',
    category: 'feature',
    trigger: 'page_load',
    actionText: 'View Wallets',
    actionUrl: '/wallets'
  }
];

export default function FeatureHints({ currentPage, userRole, isFirstVisit = false }: FeatureHintsProps) {
  const [activeHints, setActiveHints] = useState<FeatureHint[]>([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  // Load dismissed hints from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dismissedHints');
    if (stored) {
      try {
        setDismissedHints(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse dismissed hints');
        setDismissedHints([]);
      }
    }
  }, []);

  // Filter hints based on current context
  const filteredHints = useMemo(() => {
    return FEATURE_HINTS.filter(hint => {
      return hint.page === currentPage && 
             hint.userRole.includes(userRole) && 
             !dismissedHints.includes(hint.id) &&
             (isFirstVisit ? hint.trigger === 'first_visit' : hint.trigger === 'page_load');
    });
  }, [currentPage, userRole, dismissedHints, isFirstVisit]);

  // Set active hints only when filtered hints change and no active hints exist
  useEffect(() => {
    if (filteredHints.length > 0 && activeHints.length === 0) {
      setActiveHints(filteredHints);
      setCurrentHintIndex(0);
      setShowHintPanel(true);
    }
  }, [filteredHints]);

  const dismissHint = useCallback((hintId: string) => {
    const newDismissed = [...dismissedHints, hintId];
    setDismissedHints(newDismissed);
    localStorage.setItem('dismissedHints', JSON.stringify(newDismissed));
    
    // Remove from active hints
    const remaining = activeHints.filter(hint => hint.id !== hintId);
    setActiveHints(remaining);
    
    if (remaining.length === 0) {
      setShowHintPanel(false);
    } else if (currentHintIndex >= remaining.length) {
      setCurrentHintIndex(remaining.length - 1);
    }
  }, [dismissedHints, activeHints, currentHintIndex]);

  const nextHint = useCallback(() => {
    if (currentHintIndex < activeHints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    } else {
      setShowHintPanel(false);
    }
  }, [currentHintIndex, activeHints.length]);

  const toggleHintPanel = useCallback(() => {
    setShowHintPanel(!showHintPanel);
  }, [showHintPanel]);

  if (activeHints.length === 0) {
    return showFloatingButton ? (
      <FloatButton
        icon={<BulbOutlined />}
        onClick={toggleHintPanel}
        badge={{ count: 0 }}
        style={{ right: 24, bottom: 80 }}
      />
    ) : null;
  }

  const currentHint = activeHints[currentHintIndex];

  const hintContent = (
    <Card
      size="small"
      style={{ width: 320, maxWidth: '90vw' }}
      actions={[
        <Button 
          key="dismiss" 
          type="text" 
          size="small"
          icon={<CloseOutlined />}
          onClick={() => dismissHint(currentHint.id)}
        >
          Dismiss
        </Button>,
        <Button 
          key="next" 
          type="primary" 
          size="small"
          icon={<RightOutlined />}
          onClick={nextHint}
        >
          {currentHintIndex < activeHints.length - 1 ? 'Next' : 'Done'}
        </Button>
      ]}
    >
      <div style={{ marginBottom: 8 }}>
        <Badge 
          count={`${currentHintIndex + 1}/${activeHints.length}`} 
          style={{ backgroundColor: '#1890ff' }}
        />
        <Title level={5} style={{ margin: '8px 0 4px 0' }}>
          {currentHint.title}
        </Title>
      </div>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {currentHint.description}
      </Text>
      {currentHint.actionText && (
        <div style={{ marginTop: 12 }}>
          <Button type="link" size="small" style={{ padding: 0 }}>
            {currentHint.actionText}
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <>
      {showFloatingButton && (
        <FloatButton
          icon={<BulbOutlined />}
          onClick={toggleHintPanel}
          badge={{ count: activeHints.length }}
          style={{ right: 24, bottom: 80 }}
        />
      )}
      
      {showHintPanel && (
        <div 
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: '90vw'
          }}
        >
          {hintContent}
        </div>
      )}
    </>
  );
}

export function useFeatureHints(page: string, role: string) {
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Load dismissed hints from localStorage
    const stored = localStorage.getItem('dismissedHints');
    if (stored) {
      try {
        setDismissedHints(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse dismissed hints from localStorage');
        setDismissedHints([]);
      }
    }

    // Check if this is first visit to the page
    const visitKey = `firstVisit_${page}_${role}`;
    const hasVisited = localStorage.getItem(visitKey);
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem(visitKey, 'true');
    }
  }, [page, role]);

  const dismissHint = useCallback((hintId: string) => {
    setDismissedHints(prev => {
      const newDismissed = [...prev, hintId];
      localStorage.setItem('dismissedHints', JSON.stringify(newDismissed));
      return newDismissed;
    });
  }, []);

  return {
    dismissedHints,
    isFirstVisit,
    dismissHint
  };
}