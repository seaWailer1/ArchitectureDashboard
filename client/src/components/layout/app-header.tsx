import { useQuery } from "@tanstack/react-query";
import { FaBell } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { Button } from "@/components/ui/button";
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <FaCoins className="text-white w-4 h-4" />
            </div>
            <h1 className="text-lg font-semibold text-neutral-900">{t('appName')}</h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <Select value={getCurrentLanguage()} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-16 border-none bg-transparent text-neutral-600 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableLanguages().map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.code.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2 text-neutral-600 hover:text-primary">
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>
            
            {/* Profile Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getInitials(user?.firstName, user?.lastName)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
