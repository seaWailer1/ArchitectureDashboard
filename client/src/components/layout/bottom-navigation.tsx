import React from 'react';
import { Home, CreditCard, BarChart3, User, Grid3X3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BottomNavigationProps {
  currentPage?: string;
}

export default function BottomNavigation({ currentPage = 'home' }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/home' },
    { id: 'services', icon: Grid3X3, label: 'Services', href: '/services' },
    { id: 'transactions', icon: BarChart3, label: 'Activity', href: '/transactions' },
    { id: 'wallets', icon: CreditCard, label: 'Wallets', href: '/wallets' },
    { id: 'profile', icon: User, label: 'Profile', href: '/profile' }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t md:hidden safe-area-pb"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center py-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-colors touch-aaa min-w-[60px] ${
                isActive 
                  ? 'text-primary bg-primary/15' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${item.label}${isActive ? ' (current page)' : ''}`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium leading-tight">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}