// AfriPay Mobile Configuration Template
// This file configures the mobile app for different roles and platforms

import { Platform } from 'react-native';

// App Role Configuration
export const APP_ROLES = {
  CONSUMER: 'consumer',
  MERCHANT: 'merchant',
  AGENT: 'agent',
  MULTI_ROLE: 'multi-role'
};

// Feature Sets by Role
export const ROLE_FEATURES = {
  [APP_ROLES.CONSUMER]: [
    'wallet',
    'send-money',
    'receive-money',
    'qr-payments',
    'savings-challenges',
    'micro-loans',
    'virtual-cards',
    'bill-payments',
    'shopping',
    'investment',
    'crypto-trading'
  ],
  [APP_ROLES.MERCHANT]: [
    'business-wallet',
    'payment-processing',
    'qr-generation',
    'sales-analytics',
    'inventory-management',
    'customer-management',
    'bulk-payments',
    'merchant-dashboard',
    'payout-management'
  ],
  [APP_ROLES.AGENT]: [
    'cash-in-out',
    'commission-tracking',
    'customer-onboarding',
    'service-locations',
    'agent-network',
    'kyc-assistance',
    'transaction-support',
    'agent-dashboard',
    'territory-management'
  ],
  [APP_ROLES.MULTI_ROLE]: [
    'all-features',
    'role-switching',
    'unified-dashboard'
  ]
};

// Environment Configuration
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production'
};

// API Configuration
export const API_CONFIG = {
  [ENVIRONMENTS.DEVELOPMENT]: {
    baseUrl: 'http://localhost:5000',
    wsUrl: 'ws://localhost:5000',
    timeout: 10000,
    retries: 3
  },
  [ENVIRONMENTS.STAGING]: {
    baseUrl: 'https://staging-api.afripay.com',
    wsUrl: 'wss://staging-api.afripay.com',
    timeout: 15000,
    retries: 3
  },
  [ENVIRONMENTS.PRODUCTION]: {
    baseUrl: 'https://api.afripay.com',
    wsUrl: 'wss://api.afripay.com',
    timeout: 20000,
    retries: 5
  }
};

// Security Configuration
export const SECURITY_CONFIG = {
  biometricAuth: {
    enabled: true,
    fallbackToPin: true,
    maxAttempts: 3
  },
  sessionTimeout: 15 * 60 * 1000, // 15 minutes
  pinComplexity: {
    minLength: 6,
    requireSpecialChars: false,
    requireNumbers: true
  },
  certificatePinning: {
    enabled: true,
    domains: ['api.afripay.com', 'staging-api.afripay.com']
  }
};

// Currency Configuration
export const CURRENCY_CONFIG = {
  default: 'USD',
  supported: ['USD', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP', 'MAD', 'TND'],
  crypto: ['BTC', 'ETH', 'USDT', 'USDC', 'DAI'],
  exchangeRateRefresh: 5 * 60 * 1000 // 5 minutes
};

// Localization Configuration
export const LOCALIZATION_CONFIG = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'fr', 'ar', 'sw'],
  rtlLanguages: ['ar'],
  fallbackLanguage: 'en'
};

// Push Notification Configuration
export const NOTIFICATION_CONFIG = {
  types: {
    transaction: true,
    security: true,
    marketing: false,
    system: true
  },
  sound: {
    enabled: true,
    default: 'default'
  },
  badge: {
    enabled: true
  }
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  crashlytics: {
    enabled: true,
    collectUserData: false
  },
  performance: {
    enabled: true,
    networkTracking: true
  },
  userTracking: {
    enabled: false, // Privacy compliant
    anonymized: true
  }
};

// Platform-Specific Configuration
export const PLATFORM_CONFIG = {
  ios: {
    minVersion: '13.0',
    targetVersion: '18.0',
    capabilities: [
      'Face ID',
      'Touch ID',
      'Camera',
      'Location Services',
      'Push Notifications'
    ],
    frameworks: [
      'LocalAuthentication',
      'AVFoundation',
      'CoreLocation',
      'UserNotifications'
    ]
  },
  android: {
    minSdkVersion: 23, // Android 6.0
    targetSdkVersion: 35, // Android 15
    compileSdkVersion: 35,
    permissions: [
      'CAMERA',
      'USE_BIOMETRIC',
      'USE_FINGERPRINT',
      'INTERNET',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE'
    ]
  }
};

// Build Configuration
export const BUILD_CONFIG = {
  bundleIdentifier: {
    [APP_ROLES.CONSUMER]: 'com.afripay.consumer',
    [APP_ROLES.MERCHANT]: 'com.afripay.merchant',
    [APP_ROLES.AGENT]: 'com.afripay.agent',
    [APP_ROLES.MULTI_ROLE]: 'com.afripay.mobile'
  },
  appName: {
    [APP_ROLES.CONSUMER]: 'AfriPay',
    [APP_ROLES.MERCHANT]: 'AfriPay Business',
    [APP_ROLES.AGENT]: 'AfriPay Agent',
    [APP_ROLES.MULTI_ROLE]: 'AfriPay'
  },
  version: '1.0.0',
  buildNumber: 1
};

// Feature Flags
export const FEATURE_FLAGS = {
  cryptoTrading: true,
  savingsChallenges: true,
  microLoans: true,
  virtualCards: true,
  qrPayments: true,
  biometricAuth: true,
  offlineMode: false, // Future feature
  darkMode: true,
  multiLanguage: true,
  agentNetworking: true,
  merchantAnalytics: true
};

// App Configuration Factory
export const createAppConfig = (role = APP_ROLES.CONSUMER, environment = ENVIRONMENTS.DEVELOPMENT) => {
  const config = {
    role,
    environment,
    features: ROLE_FEATURES[role],
    api: API_CONFIG[environment],
    security: SECURITY_CONFIG,
    currency: CURRENCY_CONFIG,
    localization: LOCALIZATION_CONFIG,
    notifications: NOTIFICATION_CONFIG,
    analytics: ANALYTICS_CONFIG,
    platform: PLATFORM_CONFIG[Platform.OS],
    build: {
      bundleIdentifier: BUILD_CONFIG.bundleIdentifier[role],
      appName: BUILD_CONFIG.appName[role],
      version: BUILD_CONFIG.version,
      buildNumber: BUILD_CONFIG.buildNumber
    },
    featureFlags: FEATURE_FLAGS,
    
    // Admin panel is always disabled for mobile apps
    adminPanel: false,
    
    // Development settings
    isDevelopment: environment === ENVIRONMENTS.DEVELOPMENT,
    isProduction: environment === ENVIRONMENTS.PRODUCTION,
    
    // Logging configuration
    logging: {
      level: environment === ENVIRONMENTS.DEVELOPMENT ? 'debug' : 'error',
      enableFlipperIntegration: environment === ENVIRONMENTS.DEVELOPMENT,
      enableNetworkLogging: environment !== ENVIRONMENTS.PRODUCTION
    }
  };
  
  return config;
};

// Role-specific navigation configurations
export const NAVIGATION_CONFIG = {
  [APP_ROLES.CONSUMER]: {
    initialRoute: 'Home',
    tabBar: ['Home', 'Wallets', 'Services', 'Profile'],
    hiddenRoutes: ['admin', 'merchant-dashboard', 'agent-dashboard']
  },
  [APP_ROLES.MERCHANT]: {
    initialRoute: 'BusinessDashboard',
    tabBar: ['Dashboard', 'Payments', 'Analytics', 'Profile'],
    hiddenRoutes: ['admin', 'consumer-savings', 'agent-commission']
  },
  [APP_ROLES.AGENT]: {
    initialRoute: 'AgentDashboard',
    tabBar: ['Dashboard', 'Services', 'Network', 'Profile'],
    hiddenRoutes: ['admin', 'consumer-investments', 'merchant-inventory']
  },
  [APP_ROLES.MULTI_ROLE]: {
    initialRoute: 'RoleSelection',
    tabBar: ['Home', 'Wallets', 'Services', 'Profile'],
    hiddenRoutes: ['admin']
  }
};

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: '#1E40AF',
    secondary: '#059669',
    accent: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    error: '#DC2626',
    warning: '#F59E0B',
    success: '#059669',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#9CA3AF'
    }
  },
  dark: {
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#FBBF24',
      background: '#111827',
      surface: '#1F2937',
      error: '#EF4444',
      warning: '#FBBF24',
      success: '#10B981',
      text: {
        primary: '#F9FAFB',
        secondary: '#D1D5DB',
        disabled: '#6B7280'
      }
    }
  },
  typography: {
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    base: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64
  }
};

// Export default configuration
export default createAppConfig;

// Utility functions
export const getFeaturesByRole = (role) => ROLE_FEATURES[role] || [];
export const isFeatureEnabled = (feature, role) => {
  const features = getFeaturesByRole(role);
  return features.includes(feature) || features.includes('all-features');
};
export const getNavigationConfig = (role) => NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG[APP_ROLES.CONSUMER];
export const getApiConfig = (environment) => API_CONFIG[environment] || API_CONFIG[ENVIRONMENTS.DEVELOPMENT];