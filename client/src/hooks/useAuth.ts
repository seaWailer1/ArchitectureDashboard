import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  currentRole: "consumer" | "merchant" | "agent";
  language: string;
  kycStatus: "pending" | "in_progress" | "verified" | "rejected";
  phoneVerified: boolean;
  documentsVerified: boolean;
  biometricVerified: boolean;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  idNumber?: string;
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  agentCode?: string;
  creditScore: number;
  isActive: boolean;
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  currency: string;
  timezone: string;
  lastLoginAt?: string;
  passwordChangedAt?: string;
  accountLockedAt?: string;
  failedLoginAttempts: number;
  termsAcceptedAt?: string;
  privacyAcceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
