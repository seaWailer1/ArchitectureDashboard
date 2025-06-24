import { Request, Response } from 'express';
import { storage } from './storage.js';

// Track feature hint interactions for analytics
interface HintInteraction {
  userId: string;
  hintId: string;
  action: 'shown' | 'dismissed' | 'clicked' | 'completed';
  page: string;
  userRole: string;
  timestamp: Date;
}

// Get personalized hints based on user behavior
export async function getPersonalizedHints(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { page } = req.query;
    
    // Get user's dismissed hints
    const dismissedHints = await getUserDismissedHints(userId);
    
    // Get user's feature usage patterns
    const usagePatterns = await getUserUsagePatterns(userId);
    
    // Generate contextual hints based on:
    // 1. Current page
    // 2. User role
    // 3. Feature usage patterns
    // 4. Account completeness
    // 5. Recent activity
    
    const hints = await generateContextualHints(user, page as string, dismissedHints, usagePatterns);
    
    res.json({ hints });
  } catch (error) {
    console.error('Error getting personalized hints:', error);
    res.status(500).json({ error: 'Failed to get hints' });
  }
}

// Track hint interaction
export async function trackHintInteraction(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { hintId, action, page, userRole } = req.body;
    
    // Store interaction in database for analytics
    await storage.logSecurityEvent({
      userId,
      eventType: 'hint_interaction',
      severity: 'low',
      details: {
        hintId,
        action,
        page,
        userRole,
        timestamp: new Date().toISOString()
      },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown'
    });

    // If hint was dismissed, store it
    if (action === 'dismissed') {
      await storage.upsertUserPreference({
        userId,
        category: 'hints',
        key: `dismissed_${hintId}`,
        value: 'true'
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking hint interaction:', error);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
}

// Get user's feature completion status
export async function getFeatureCompletionStatus(req: Request, res: Response) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await storage.getUser(userId);
    const wallets = await storage.getUserWallets(userId);
    const transactions = await storage.getTransactionsByWalletId(wallets[0]?.id || 0, 5);
    
    const completionStatus = {
      profileSetup: {
        completed: !!(user?.firstName && user?.lastName),
        progress: calculateProfileProgress(user)
      },
      kycVerification: {
        completed: user?.kycStatus === 'verified',
        progress: calculateKycProgress(user)
      },
      firstTransaction: {
        completed: transactions.length > 0,
        progress: transactions.length > 0 ? 100 : 0
      },
      walletSetup: {
        completed: wallets.length > 0,
        progress: wallets.length > 0 ? 100 : 0
      },
      securitySetup: {
        completed: user?.phoneVerified && user?.documentsVerified,
        progress: calculateSecurityProgress(user)
      }
    };

    res.json({ completionStatus });
  } catch (error) {
    console.error('Error getting feature completion status:', error);
    res.status(500).json({ error: 'Failed to get completion status' });
  }
}

// Helper functions
async function getUserDismissedHints(userId: string): Promise<string[]> {
  try {
    const preferences = await storage.getUserPreferences(userId);
    return preferences
      .filter(pref => pref.category === 'hints' && pref.key.startsWith('dismissed_'))
      .map(pref => pref.key.replace('dismissed_', ''));
  } catch (error) {
    console.error('Error getting dismissed hints:', error);
    return [];
  }
}

async function getUserUsagePatterns(userId: string): Promise<any> {
  try {
    // Get recent security logs to understand user behavior
    const logs = await storage.getSecurityLogs(userId, 50);
    
    const patterns = {
      mostUsedFeatures: [],
      lastLoginTime: null,
      loginFrequency: 0,
      preferredPages: [],
      deviceTypes: []
    };

    // Analyze logs to extract usage patterns
    // This is a simplified version - in production you'd want more sophisticated analytics
    
    return patterns;
  } catch (error) {
    console.error('Error getting usage patterns:', error);
    return {};
  }
}

async function generateContextualHints(user: any, page: string, dismissedHints: string[], usagePatterns: any): Promise<any[]> {
  const hints = [];
  
  // Profile completion hints
  if (!user.firstName || !user.lastName) {
    hints.push({
      id: 'complete-profile',
      title: 'Complete Your Profile',
      description: 'Add your name and other details to personalize your experience and unlock all features.',
      priority: 'high',
      category: 'action',
      actionText: 'Complete Profile',
      actionUrl: '/profile'
    });
  }

  // KYC verification hints
  if (user.kycStatus !== 'verified') {
    hints.push({
      id: 'verify-identity',
      title: 'Verify Your Identity',
      description: 'Complete KYC verification to increase transaction limits and access premium features.',
      priority: 'high',
      category: 'action',
      actionText: 'Start Verification',
      actionUrl: '/kyc'
    });
  }

  // Security enhancement hints
  if (!user.phoneVerified) {
    hints.push({
      id: 'verify-phone',
      title: 'Verify Your Phone Number',
      description: 'Add an extra layer of security and enable SMS notifications.',
      priority: 'medium',
      category: 'feature',
      actionText: 'Verify Phone',
      actionUrl: '/profile?tab=security'
    });
  }

  // Page-specific hints
  switch (page) {
    case 'wallets':
      if (user.currentRole === 'consumer') {
        hints.push({
          id: 'explore-crypto',
          title: 'Try Cryptocurrency Trading',
          description: 'Your account supports crypto trading with real-time market data and secure storage.',
          priority: 'medium',
          category: 'feature',
          actionText: 'Explore Crypto',
          actionUrl: '/crypto'
        });
      }
      break;
      
    case 'services':
      if (user.currentRole === 'merchant') {
        hints.push({
          id: 'setup-store',
          title: 'Set Up Your Online Store',
          description: 'Create a digital storefront to sell products and services online.',
          priority: 'high',
          category: 'feature',
          actionText: 'Create Store'
        });
      }
      break;
  }

  // Filter out dismissed hints
  return hints.filter(hint => !dismissedHints.includes(hint.id));
}

function calculateProfileProgress(user: any): number {
  let progress = 0;
  const fields = ['firstName', 'lastName', 'email', 'phone'];
  fields.forEach(field => {
    if (user[field]) progress += 25;
  });
  return Math.min(progress, 100);
}

function calculateKycProgress(user: any): number {
  let progress = 0;
  if (user.phoneVerified) progress += 33;
  if (user.documentsVerified) progress += 33;
  if (user.biometricVerified) progress += 34;
  return Math.min(progress, 100);
}

function calculateSecurityProgress(user: any): number {
  let progress = 0;
  if (user.phoneVerified) progress += 50;
  if (user.documentsVerified) progress += 50;
  return Math.min(progress, 100);
}