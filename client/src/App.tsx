import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { SkipNav } from "@/components/ui/accessibility";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Wallets from "@/pages/wallets";
import Transactions from "@/pages/transactions";
import QR from "@/pages/qr";
import Services from "@/pages/services";
import Profile from "@/pages/profile";
import SignIn from "@/pages/signin";
import TestLogin from "@/pages/test-login";
import Onboarding from "@/pages/onboarding";
import KYC from "@/pages/kyc";
import PresetUsers from "@/pages/preset-users";
import PartnershipsPage from "@/pages/partnerships";
import AccessibilityDemo from "@/pages/accessibility-demo";
import { ComponentLibrary } from "@/pages/component-library";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading AfriPay...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show test login or sign in
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/test-login" component={TestLogin} />
        <Route path="/signin" component={SignIn} />
        <Route path="/" component={TestLogin} />
        <Route component={TestLogin} />
      </Switch>
    );
  }

  // Check if user needs onboarding
  if (!user?.firstName || !user?.lastName) {
    return (
      <Switch>
        <Route path="/test-login" component={TestLogin} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/" component={TestLogin} />
        <Route component={TestLogin} />
      </Switch>
    );
  }

  // Check if user needs KYC
  if (user?.kycStatus !== 'verified') {
    return (
      <Switch>
        <Route path="/test-login" component={TestLogin} />
        <Route path="/kyc" component={KYC} />
        <Route path="/" component={KYC} />
        <Route component={KYC} />
      </Switch>
    );
  }

  // Authenticated and verified - show main app with accessibility enhancements
  return (
    <>
      <SkipNav />
      <div id="main-content" role="main" tabIndex={-1}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/qr" component={QR} />
          <Route path="/services" component={Services} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/wallets" component={Wallets} />
          <Route path="/test-login" component={TestLogin} />
          <Route path="/signin" component={SignIn} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/kyc" component={KYC} />
          <Route path="/preset-users" component={PresetUsers} />
          <Route path="/partnerships" component={PartnershipsPage} />
          <Route path="/accessibility-demo" component={AccessibilityDemo} />
          <Route path="/component-library" component={ComponentLibrary} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
