import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import RoleSwitcher from "@/components/role/role-switcher";
import WalletSummary from "@/components/wallet/wallet-summary";
import QuickActions from "@/components/wallet/quick-actions";
import RecentTransactions from "@/components/transactions/recent-transactions";
import MiniAppLauncher from "@/components/mini-apps/mini-app-launcher";
import KYCStatusCard from "@/components/kyc/kyc-status-card";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
            <i className="fas fa-coins text-white text-sm"></i>
          </div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      <RoleSwitcher />
      
      <main className="max-w-md mx-auto px-4 pb-20">
        <WalletSummary />
        <QuickActions />
        <RecentTransactions />
        <MiniAppLauncher />
        <KYCStatusCard />
      </main>
      
      <BottomNavigation currentPage="home" />
    </div>
  );
}
