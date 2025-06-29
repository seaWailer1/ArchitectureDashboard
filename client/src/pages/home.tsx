import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";

import ConsumerDashboard from "@/components/dashboard/consumer-dashboard";
import MerchantDashboard from "@/components/dashboard/merchant-dashboard";
import AgentDashboard from "@/components/dashboard/agent-dashboard";
import { UserProfile } from "@/types";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { tm, isRTL } = useLanguage();
  
  const { data: user } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-floating animate-pulse">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Loading AfriPay</h2>
            <p className="text-muted-foreground">Setting up your dashboard...</p>
          </div>
          <div className="w-8 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderRoleSpecificContent = () => {
    switch (user?.currentRole) {
      case 'merchant':
        return <MerchantDashboard />;
      case 'agent':
        return <AgentDashboard />;
      default: // consumer
        return <ConsumerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <AppHeader />
      
      <main className="container-content spacing-y-md pb-24">
        {renderRoleSpecificContent()}
      </main>
      
      <BottomNavigation currentPage="home" />
    </div>
  );
}
