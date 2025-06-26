import { Link, useLocation } from "wouter";
import { FaHome, FaWallet, FaQrcode, FaTh, FaUser } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface BottomNavigationProps {
  currentPage?: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: FaHome, label: t('home'), id: "home" },
    { path: "/wallets", icon: FaWallet, label: "FaWallets", id: "wallets" },
    { path: "/qr", icon: FaQrcode, label: t('pay'), id: "qr", special: true },
    { path: "/services", icon: FaTh, label: t('services'), id: "services" },
    { path: "/profile", icon: FaUser, label: t('profile'), id: "profile" },
  ];

  const isActive = (path: string, id: string) => {
    if (currentPage) return currentPage === id;
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.id);

            return (
              <Link key={item.id} href={item.path}>
                <button className="flex flex-col items-center py-2 px-3 transition-colors">
                  {item.special ? (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-1">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <Icon 
                      className={cn(
                        "w-5 h-5 mb-1",
                        active ? "text-primary" : "text-neutral-600"
                      )} 
                    />
                  )}
                  <span 
                    className={cn(
                      "text-xs font-medium",
                      active ? "text-primary" : "text-neutral-600"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
