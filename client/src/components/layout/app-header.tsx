import { useQuery } from "@tanstack/react-query";
import { Bell, Coins, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibleButton } from "@/components/ui/accessibility";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserProfile } from "@/types";
import { useLocation } from "wouter";

export default function AppHeader() {
  const [, setLocation] = useLocation();
  const { tm, formatCurrency } = useLanguage();
  const { data: user } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <header 
      className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm border-b border-neutral-200/50 dark:border-neutral-700/50 sticky top-0 z-50"
      role="banner"
    >
      <div className="container-app py-3">
        <div className="flex items-center justify-between">
          {/* App Logo and Title */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 bg-gradient-to-br from-primary via-orange-500 to-red-500 rounded-xl flex items-center justify-center touch-aaa shadow-lg"
              role="img"
              aria-label="AfriPay logo"
            >
              <Coins className="text-white w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
              {tm.appName}
            </h1>
          </div>
          
          {/* Navigation Controls */}
          <nav className="flex items-center gap-2" role="navigation" aria-label="Header navigation">
            {/* QR Code Scanner/Generator */}
            <AccessibleButton
              variant="ghost"
              size="md"
              className="w-10 h-10 rounded-xl touch-aaa text-neutral-700 dark:text-neutral-300 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-aaa transition-all"
              onClick={() => setLocation('/qr')}
              aria-label="QR Code Scanner and Generator"
            >
              <QrCode className="w-5 h-5" aria-hidden="true" />
            </AccessibleButton>
            
            {/* Language Switcher */}
            <LanguageSelector variant="minimal" />
            
            {/* Notifications */}
            <AccessibleButton
              variant="ghost"
              size="md"
              className="relative w-10 h-10 rounded-xl touch-aaa text-neutral-700 dark:text-neutral-300 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-aaa transition-all"
              aria-label="Notifications (2 unread)"
              aria-describedby="notification-count"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span 
                id="notification-count"
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                aria-label="2 unread notifications"
              >
                2
              </span>
              <span className="sr-only">You have 2 unread notifications</span>
            </AccessibleButton>
            
            {/* Profile Avatar */}
            <AccessibleButton
              variant="ghost"
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full touch-aaa focus-aaa shadow-sm hover:shadow-md transition-all"
              aria-label={`User profile: ${user?.firstName || 'User'} ${user?.lastName || ''}`}
            >
              <span className="text-white text-sm font-semibold" aria-hidden="true">
                {getInitials(user?.firstName, user?.lastName)}
              </span>
            </AccessibleButton>
          </nav>
        </div>
      </div>
    </header>
  );
}
