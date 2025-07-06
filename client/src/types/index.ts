export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  currentRole: 'consumer' | 'merchant' | 'agent';
  language: string;
  kycStatus: 'pending' | 'in_progress' | 'verified' | 'rejected';
  phoneVerified: boolean;
  documentsVerified: boolean;
  biometricVerified: boolean;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  currency?: string;
  timezone?: string;
  twoFactorEnabled?: boolean;
  passwordChangedAt?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  darkMode?: boolean;
}

export interface WalletData {
  id: number;
  userId: string;
  balance: string;
  pendingBalance: string;
  currency: string;
  isActive: boolean;
}

export interface TransactionData {
  id: number;
  fromWalletId?: number;
  toWalletId?: number;
  amount: string;
  currency: string;
  type: 'send' | 'receive' | 'topup' | 'withdraw' | 'payment';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  qrCode?: string;
  createdAt: string;
}

export interface QRData {
  userId: string;
  amount?: string;
  description: string;
  timestamp: number;
}

export interface MiniApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
