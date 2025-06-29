import React, { useState } from 'react';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccessibleInput } from '@/components/ui/accessibility';
import { SkipNav } from '@/components/ui/accessibility';

export default function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <SkipNav />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-content flex h-16 sm:h-14 items-center px-4">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden mr-3 touch-aaa"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl font-bold text-primary">AfriPay</h1>
          </div>

          {/* Desktop Search */}
          <div className="hidden sm:flex flex-1 items-center justify-center max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full h-10 rounded-xl border border-input bg-background pl-10 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Search AfriPay services"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 ml-auto">
            {/* Mobile Search Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="sm:hidden touch-aaa"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative touch-aaa"
              aria-label="Notifications (3 unread)"
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                aria-hidden="true"
              >
                3
              </Badge>
            </Button>

            {/* Profile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="touch-aaa"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden border-t px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search AfriPay services..."
              className="w-full h-10 rounded-xl border border-input bg-background pl-10 pr-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Search AfriPay services"
            />
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg">
            <nav className="px-4 py-4 space-y-3">
              <a href="/home" className="block py-3 px-3 rounded-lg hover:bg-muted transition-colors touch-aaa text-base font-medium">
                Dashboard
              </a>
              <a href="/services" className="block py-3 px-3 rounded-lg hover:bg-muted transition-colors touch-aaa text-base font-medium">
                Services
              </a>
              <a href="/transactions" className="block py-3 px-3 rounded-lg hover:bg-muted transition-colors touch-aaa text-base font-medium">
                Transactions
              </a>
              <a href="/profile" className="block py-3 px-3 rounded-lg hover:bg-muted transition-colors touch-aaa text-base font-medium">
                Profile
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}