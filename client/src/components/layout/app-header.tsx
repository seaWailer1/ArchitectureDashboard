import { useQuery } from "@tanstack/react-query";
import { Bell, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibleButton } from "@/components/ui/accessibility";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { t, setLanguage, getCurrentLanguage, getAvailableLanguages, type Language } from "@/lib/i18n";
import { UserProfile } from "@/types";

export default function AppHeader() {
  const { data: user } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    // Force re-render by updating a state or triggering a refresh
    window.location.reload();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <header 
      className="bg-white dark:bg-neutral-900 shadow-sm border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50"
      role="banner"
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-aaa">
          {/* App Logo and Title */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center touch-aaa"
              role="img"
              aria-label="AfriPay logo"
            >
              <Coins className="text-white w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 text-aaa-large">
              {t('appName')}
            </h1>
          </div>
          
          {/* Navigation Controls */}
          <nav className="flex items-center gap-aaa" role="navigation" aria-label="Header navigation">
            {/* Language Switcher */}
            <div className="relative">
              <Select 
                value={getCurrentLanguage()} 
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger 
                  className="min-w-[44px] min-h-[44px] border-2 border-neutral-300 dark:border-neutral-600 bg-transparent text-neutral-700 dark:text-neutral-300 text-aaa-normal font-medium focus-aaa"
                  aria-label="Select language"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-2 border-neutral-300 dark:border-neutral-600">
                  {getAvailableLanguages().map((lang) => (
                    <SelectItem 
                      key={lang.code} 
                      value={lang.code}
                      className="text-aaa-normal focus:bg-primary focus:text-primary-foreground"
                    >
                      <span className="sr-only">{lang.name}</span>
                      {lang.code.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Notifications */}
            <AccessibleButton
              variant="ghost"
              size="md"
              className="relative touch-aaa text-neutral-700 dark:text-neutral-300 hover:text-primary hover:bg-primary/10 focus-aaa"
              aria-label="Notifications (2 unread)"
              aria-describedby="notification-count"
            >
              <Bell className="w-6 h-6" aria-hidden="true" />
              <span 
                id="notification-count"
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center"
                aria-label="2 unread notifications"
              >
                2
              </span>
              <span className="sr-only">You have 2 unread notifications</span>
            </AccessibleButton>
            
            {/* Profile Avatar */}
            <AccessibleButton
              variant="ghost"
              className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full touch-aaa focus-aaa"
              aria-label={`User profile: ${user?.firstName || 'User'} ${user?.lastName || ''}`}
            >
              <span className="text-white text-aaa-normal font-semibold" aria-hidden="true">
                {getInitials(user?.firstName, user?.lastName)}
              </span>
            </AccessibleButton>
          </nav>
        </div>
      </div>
    </header>
  );
}
