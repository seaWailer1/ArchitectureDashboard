import { Link, useLocation } from "wouter";
import { Home, Wallet, List, QrCode, Grid3X3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface BottomNavigationProps {
  currentPage?: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: t('home'), id: "home" },
    { path: "/wallets", icon: Wallet, label: "Wallets", id: "wallets" },
    { path: "/transactions", icon: List, label: "History", id: "transactions" },
    { path: "/services", icon: Grid3X3, label: t('services'), id: "services" },
    { path: "/profile", icon: User, label: t('profile'), id: "profile" },
  ];

  const isActive = (path: string, id: string) => {
    if (currentPage) return currentPage === id;
    return location === path;
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t-2 border-neutral-300 dark:border-neutral-700 shadow-lg z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-app">
        <div className="flex justify-around spacing-y-xs gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.id);

            return (
              <Link key={item.id} href={item.path}>
                <button 
                  className={cn(
                    "flex flex-col items-center py-3 px-3 transition-colors touch-aaa rounded-lg",
                    "min-h-[44px] min-w-[44px] focus-aaa text-aaa-small",
                    "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    active && "bg-primary/10 dark:bg-primary/20"
                  )}
                  aria-current={active ? "page" : undefined}
                  aria-label={`${item.label} ${active ? "(current page)" : ""}`}
                >
                  <Icon 
                    className={cn(
                      "w-6 h-6 mb-1",
                      active 
                        ? "text-primary dark:text-primary" 
                        : "text-neutral-700 dark:text-neutral-300"
                    )}
                    aria-hidden="true"
                  />
                  <span 
                    className={cn(
                      "text-xs font-semibold leading-tight",
                      active 
                        ? "text-primary dark:text-primary" 
                        : "text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span className="sr-only">Current page</span>
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
