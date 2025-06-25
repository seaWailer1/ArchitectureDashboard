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
    id: 'home-role-switching',
    title: 'Switch User Roles',
    description: 'Access your Profile to switch between Consumer, Merchant, and Agent roles for different features.',
    page: 'home',
    userRole: ['consumer', 'merchant', 'agent'],
    priority: 'medium',
    category: 'feature',
    trigger: 'idle',
    actionText: 'View Profile',
    actionUrl: '/profile'
  },
  
  // Wallets Page Hints
  {
    id: 'wallets-multiple-types',
    title: 'Multiple Wallet Types',
    description: 'Manage different wallet types: Primary for daily use, Savings for goals, Crypto for investments, and Investment for wealth building.',
    page: 'wallets',
    userRole: ['consumer', 'merchant'],
    priority: 'high',
    category: 'feature',
    trigger: 'first_visit'
  },
  {
    id: 'wallets-crypto-trading',
    title: 'Crypto Trading Available',
    description: 'Your Crypto wallet supports buying, selling, and trading cryptocurrencies with real-time market data.',
    page: 'wallets',
    userRole: ['consumer'],
    priority: 'medium',
    category: 'feature',
    trigger: 'page_load',
    actionText: 'Explore Crypto',
    actionUrl: '/crypto'
  },
  
  // Services Page Hints
  {
    id: 'services-bill-payments',
    title: 'Pay All Your Bills',
    description: 'Pay utilities, mobile top-ups, subscriptions, and more directly from your wallet.',
    page: 'services',
    userRole: ['consumer'],
    priority: 'high',
    category: 'feature',
    trigger: 'first_visit'
  },
  {
    id: 'services-merchant-tools',
    title: 'Business Tools Available',
    description: 'Access merchant dashboard, inventory management, and sales analytics in the Services section.',
    page: 'services',
    userRole: ['merchant'],
    priority: 'high',
    category: 'feature',
    trigger: 'page_load'
  },
  {
    id: 'services-agent-network',
    title: 'Agent Network Features',
    description: 'Manage cash-in/cash-out services, commission tracking, and customer management tools.',
    page: 'services',
    userRole: ['agent'],
    priority: 'high',
    category: 'feature',
    trigger: 'page_load'
  },
  
  // QR Page Hints
  {
    id: 'qr-merchant-payments',
    title: 'Accept Customer Payments',
    description: 'Generate QR codes for customers to scan and pay instantly. Perfect for businesses and service providers.',
    page: 'qr',
    userRole: ['merchant', 'agent'],
    priority: 'high',
    category: 'action',
    trigger: 'first_visit'
  },
  {
    id: 'qr-contactless-payments',
    title: 'Contactless Payments',
    description: 'Scan QR codes to pay without cash or cards. Safer, faster, and more convenient.',
    page: 'qr',
    userRole: ['consumer'],
    priority: 'medium',
    category: 'tip',
    trigger: 'page_load'
  },
  
  // Profile Page Hints
  {
    id: 'profile-kyc-verification',
    title: 'Complete KYC Verification',
    description: 'Verify your identity to unlock higher transaction limits and access premium features.',
    page: 'profile',
    userRole: ['consumer', 'merchant', 'agent'],
    priority: 'high',
    category: 'action',
    trigger: 'first_visit',
    actionText: 'Start Verification'
  },
  {
    id: 'profile-security-settings',
    title: 'Enhanced Security Options',
    description: 'Enable 2FA, manage trusted devices, and set up biometric authentication for maximum security.',
    page: 'profile',
    userRole: ['consumer', 'merchant', 'agent'],
    priority: 'medium',
    category: 'feature',
    trigger: 'page_load'
  }
];

export default function FeatureHints({ currentPage, userRole, isFirstVisit = false }: FeatureHintsProps) {
  const [activeHints, setActiveHints] = useState<FeatureHint[]>([]);
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  // Load dismissed hints from localStorage
  useEffect(() => {
    const dismissed = JSON.parse(localStorage.getItem('dismissedHints') || '[]');
    setDismissedHints(dismissed);
  }, []);

  // Filter relevant hints based on current context
  const filteredHints = useMemo(() => {
    const relevantHints = FEATURE_HINTS.filter(hint => {
      const isPageMatch = hint.page === currentPage;
      const isRoleMatch = hint.userRole.includes(userRole);
      const isNotDismissed = !dismissedHints.includes(hint.id);
      const isTriggerMatch = 
        hint.trigger === 'page_load' ||
        (hint.trigger === 'first_visit' && isFirstVisit);
      
      return isPageMatch && isRoleMatch && isNotDismissed && isTriggerMatch;
    });

    // Sort by priority
    return relevantHints.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [currentPage, userRole, isFirstVisit, dismissedHints]);

  useEffect(() => {
    if (filteredHints.length > 0 && activeHints.length === 0) {
      setActiveHints(filteredHints);
      setCurrentHintIndex(0);
      setShowHintPanel(true);
    }
  }, [filteredHints, activeHints.length]);

  // Set up idle detection for idle-triggered hints
  useEffect(() => {
    const handleActivity = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      
      const timer = setTimeout(() => {
        const idleHints = FEATURE_HINTS.filter(hint => {
          return hint.page === currentPage && 
                 hint.userRole.includes(userRole) && 
                 hint.trigger === 'idle' &&
                 !dismissedHints.includes(hint.id);
        });
        
        if (idleHints.length > 0 && activeHints.length === 0) {
          setActiveHints(idleHints);
          setShowHintPanel(true);
        }
      }, 30000); // 30 seconds of inactivity
      
      setIdleTimer(timer);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    handleActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [currentPage, userRole, dismissedHints]);

  const dismissHint = useCallback((hintId: string) => {
    const newDismissed = [...dismissedHints, hintId];
    setDismissedHints(newDismissed);
    localStorage.setItem('dismissedHints', JSON.stringify(newDismissed));
    
    const remainingHints = activeHints.filter(hint => hint.id !== hintId);
    setActiveHints(remainingHints);
    
    if (remainingHints.length === 0) {
      setShowHintPanel(false);
    } else if (currentHintIndex >= remainingHints.length) {
      setCurrentHintIndex(remainingHints.length - 1);
    }
  }, [dismissedHints, activeHints, currentHintIndex]);

  const nextHint = () => {
    if (currentHintIndex < activeHints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  const previousHint = () => {
    if (currentHintIndex > 0) {
      setCurrentHintIndex(currentHintIndex - 1);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return '🚀';
      case 'navigation': return '🧭';
      case 'action': return '⚡';
      case 'tip': return '💡';
      default: return '💡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  if (activeHints.length === 0 || !showHintPanel) {
    return (
      <FloatButton
        icon={<BulbOutlined />}
        tooltip="Feature Tips"
        onClick={() => {
          // Show general tips or recently dismissed hints
          const generalHints = FEATURE_HINTS.filter(hint => 
            hint.page === currentPage && hint.userRole.includes(userRole)
          );
          if (generalHints.length > 0) {
            setActiveHints(generalHints.slice(0, 3));
            setShowHintPanel(true);
          }
        }}
        style={{ 
          right: 24, 
          bottom: 80,
          backgroundColor: '#1890ff'
        }}
      />
    );
  }

  const currentHint = activeHints[currentHintIndex];

  const hintContent = (
    <Card
      size="small"
      style={{ 
        width: 320,
        maxWidth: '90vw',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
      styles={{
        body: { padding: '16px' }
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Badge 
            color={getPriorityColor(currentHint.priority)}
            text={currentHint.category.charAt(0).toUpperCase() + currentHint.category.slice(1)}
          />
          <Button 
            type="text" 
            size="small" 
            icon={<CloseOutlined />}
            onClick={() => dismissHint(currentHint.id)}
          />
        </div>
        
        <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{getCategoryIcon(currentHint.category)}</span>
          {currentHint.title}
        </Title>
      </div>
      
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, lineHeight: '1.5' }}>
        {currentHint.description}
      </Text>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeHints.length > 1 && (
            <>
              <Button 
                size="small" 
                disabled={currentHintIndex === 0}
                onClick={previousHint}
              >
                Previous
              </Button>
              <Button 
                size="small" 
                disabled={currentHintIndex === activeHints.length - 1}
                onClick={nextHint}
                icon={<RightOutlined />}
              >
                Next
              </Button>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {currentHint.actionText && currentHint.actionUrl && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => {
                window.location.href = currentHint.actionUrl!;
                dismissHint(currentHint.id);
              }}
            >
              {currentHint.actionText}
            </Button>
          )}
          <Button 
            size="small"
            icon={<CheckOutlined />}
            onClick={() => dismissHint(currentHint.id)}
          >
            Got it
          </Button>
        </div>
      </div>
      
      {activeHints.length > 1 && (
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#8c8c8c' }}>
          {currentHintIndex + 1} of {activeHints.length} tips
        </div>
      )}
    </Card>
  );

  return (
    <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 1000 }}>
      {hintContent}
    </div>
  );
}

// Hook for easy integration
export function useFeatureHints(currentPage: string, userRole: string) {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const visitKey = `firstVisit_${currentPage}_${userRole}`;
    const hasVisited = localStorage.getItem(visitKey);
    
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem(visitKey, 'true');
    }
  }, [currentPage, userRole]);

  return { isFirstVisit };
}