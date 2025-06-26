import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FaDollarSign, 
  FaTrendingUp, 
  TrendingDown, 
  FaEye, 
  FaEyeSlash,
  FaPlus,
  ArrowUpDown,
  Wallet,
  PiggyBank,
  LineChart,
  Bitcoin
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";

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
      {/* Main Balance Card */}
      <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="relative z-10 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Balance</p>
              <div className="flex items-center space-x-3">
                <h2 className="text-3xl font-bold">
                  {formatCurrency(
                    parseFloat(primaryWallet?.balance || "0") + 
                    totalInvestmentValue + 
                    totalCryptoValue
                  )}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-1"
                  onClick={() => setShowBalances(!showBalances)}
                >
                  {showBalances ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Available Credit</p>
              <p className="text-xl font-semibold">{formatCurrency(totalCreditAvailable)}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
              <FaPlus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Transfer
            </Button>
          </div>
        </CardContent>
      </Card>

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