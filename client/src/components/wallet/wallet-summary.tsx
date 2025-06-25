import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { WalletData } from "@/types";

export default function WalletSummary() {
  const [showBalance, setShowBalance] = useState(true);
  
  const { data: wallet } = useQuery<WalletData>({
    queryKey: ["/api/wallet"],
  });

  const formatBalance = (balance?: string) => {
    if (!balance) return "$0.00";
    return `$${parseFloat(balance).toFixed(2)}`;
  };

  const displayBalance = (balance?: string) => {
    if (!showBalance) return "****";
    return formatBalance(balance);
  };

  return (
    <section className="py-6">
      <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">{t('totalBalance')}</p>
              <p className="text-2xl font-bold">
                {displayBalance(wallet?.balance)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <p className="text-white/80 text-xs">{t('available')}</p>
              <p className="font-semibold">
                {displayBalance(wallet?.balance)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs">{t('pending')}</p>
              <p className="font-semibold">
                {displayBalance(wallet?.pendingBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
