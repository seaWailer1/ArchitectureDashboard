import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff,
  Plus,
  ArrowUpDown,
  Wallet,
  PiggyBank,
  LineChart,
  Bitcoin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";
import { AccessibleButton } from "@/components/ui/accessibility"; // Assuming this component exists

interface WalletData {
  id: number;
  walletType: string;
  balance: string;
  currency: string;
  dailyLimit: string;
  monthlyLimit: string;
}

interface AssetHolding {
  id: number;
  asset: {
    symbol: string;
    name: string;
    type: string;
    iconUrl?: string;
    exchangeRate: string;
    priceChange24h: string;
  };
  balance: string;
  totalInvested: string;
  averageBuyPrice: string;
}

interface Investment {
  id: number;
  product: {
    name: string;
    type: string;
    expectedReturn: string;
    riskLevel: string;
  };
  principalAmount: string;
  currentValue: string;
  interestEarned: string;
  status: string;
}

interface CreditFacility {
  id: number;
  type: string;
  creditLimit: string;
  availableCredit: string;
  usedCredit: string;
  interestRate: string;
  status: string;
}

// New EnhancedWalletSummary Component
interface EnhancedWalletSummaryProps {
  totalBalance: number;
  hideBalance?: boolean;
  onToggleBalance: () => void;
}

function NewEnhancedWalletSummary({ 
  totalBalance, 
  hideBalance = false, 
  onToggleBalance 
}: EnhancedWalletSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-medium opacity-90">
            Total Balance
          </CardTitle>
          <AccessibleButton
            variant="ghost"
            size="sm"
            onClick={onToggleBalance}
            className="text-white hover:bg-white/20 h-10 w-10 p-0 touch-aaa"
            aria-label={hideBalance ? "Show balance" : "Hide balance"}
          >
            {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </AccessibleButton>
        </div>
      </CardHeader>
      <CardContent className="pb-4 sm:pb-6 px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <div 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
              aria-label={hideBalance ? "Balance hidden" : `Balance: ${totalBalance.toLocaleString()} Naira`}
            >
              {hideBalance ? '••••••' : `₦${totalBalance.toLocaleString()}`}
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className="bg-white/20 text-white text-xs sm:text-sm px-2 py-1"
                aria-label="12.5% increase from last month"
              >
                +12.5%
              </Badge>
              <span className="text-xs sm:text-sm opacity-80">vs last month</span>
            </div>
          </div>

          {/* Mobile-First Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <AccessibleButton 
              size="lg" 
              className="flex-1 bg-white text-primary hover:bg-white/90 font-semibold rounded-xl"
              aria-label="Add money to wallet"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Money
            </AccessibleButton>
            <AccessibleButton 
              size="lg" 
              variant="ghost" 
              className="flex-1 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl"
              aria-label="Send money"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Send
            </AccessibleButton>
          </div>

          {/* Quick Stats - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20">
            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm opacity-80">This Month</div>
              <div className="text-sm sm:text-base font-semibold">₦45,230</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs sm:text-sm opacity-80">Saved</div>
              <div className="text-sm sm:text-base font-semibold">₦12,500</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function EnhancedWalletSummary() {
  const [showBalances, setShowBalances] = useState(true);
  const { toast } = useToast();

  const { data: wallets = [] } = useQuery<WalletData[]>({
    queryKey: ["/api/wallets"],
  });

  const { data: holdings = [] } = useQuery<AssetHolding[]>({
    queryKey: ["/api/wallets/holdings"],
  });

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const { data: creditFacilities = [] } = useQuery<CreditFacility[]>({
    queryKey: ["/api/credit-facilities"],
  });

  const primaryWallet = wallets.find(w => w.walletType === 'primary') || wallets[0];
  const cryptoWallet = wallets.find(w => w.walletType === 'crypto');
  const investmentWallet = wallets.find(w => w.walletType === 'investment');

  const totalInvestmentValue = investments.reduce((sum, inv) => 
    sum + parseFloat(inv.currentValue || "0"), 0
  );

  const totalCryptoValue = holdings
    .filter(h => h.asset.type === 'cryptocurrency')
    .reduce((sum, holding) => 
      sum + (parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate)), 0
    );

  const totalCreditAvailable = creditFacilities.reduce((sum, facility) => 
    sum + parseFloat(facility.availableCredit || "0"), 0
  );

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'crypto':
        return <Bitcoin className="w-5 h-5" />;
      case 'investment':
        return <LineChart className="w-5 h-5" />;
      case 'savings':
        return <PiggyBank className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: string | number, currency = "USD") => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!showBalances) return "••••";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatCrypto = (amount: string, symbol: string) => {
    if (!showBalances) return "••••";
    return `${parseFloat(amount).toFixed(8)} ${symbol}`;
  };

  const getPriceChangeColor = (change: string) => {
    const value = parseFloat(change);
    if (value > 0) return "text-success";
    if (value < 0) return "text-destructive";
    return "text-neutral-600";
  };

  return (
    <div className="space-y-6">
      {/* Main Balance Card - Using the new component */}
      <NewEnhancedWalletSummary
        totalBalance={parseFloat(primaryWallet?.balance || "0") + 
                      totalInvestmentValue + 
                      totalCryptoValue}
        hideBalance={!showBalances}
        onToggleBalance={() => setShowBalances(!showBalances)}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <PiggyBank className="w-6 h-6 text-success" />
              <span className="text-sm">Start Saving</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <LineChart className="w-6 h-6 text-accent" />
              <span className="text-sm">Invest Now</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}