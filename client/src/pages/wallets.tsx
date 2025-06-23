import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Bitcoin, 
  Plus, 
  Eye, 
  EyeOff,
  Send,
  ArrowDownToLine,
  MoreVertical,
  PiggyBank,
  Building2,
  Coins
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { useToast } from "@/hooks/use-toast";

interface WalletData {
  id: number;
  userId: string;
  balance: string;
  pendingBalance: string;
  currency: string;
  walletType: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetHolding {
  id: number;
  balance: string;
  totalInvested: string;
  averageBuyPrice: string;
  asset: {
    symbol: string;
    name: string;
    type: string;
    iconUrl?: string;
    exchangeRate: string;
    priceChange24h?: string;
  };
}

interface Investment {
  id: number;
  principalAmount: string;
  currentValue: string;
  interestEarned: string;
  status: string;
  startDate: string;
  maturityDate: string;
  product: {
    name: string;
    type: string;
    expectedReturn: string;
    riskLevel: string;
  };
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

export default function Wallets() {
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

  // Calculate total balances
  const totalFiatBalance = wallets.reduce((sum, wallet) => 
    sum + parseFloat(wallet.balance || "0"), 0
  );

  const totalCryptoValue = holdings
    .filter(h => h.asset.type === 'cryptocurrency')
    .reduce((sum, holding) => 
      sum + (parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate)), 0
    );

  const totalInvestmentValue = investments.reduce((sum, inv) => 
    sum + parseFloat(inv.currentValue || "0"), 0
  );

  const totalCreditAvailable = creditFacilities.reduce((sum, facility) => 
    sum + parseFloat(facility.availableCredit || "0"), 0
  );

  const totalNetWorth = totalFiatBalance + totalCryptoValue + totalInvestmentValue;

  const formatCurrency = (amount: string | number, currency = "USD") => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(num);
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'primary': return Wallet;
      case 'savings': return PiggyBank;
      case 'crypto': return Bitcoin;
      case 'investment': return TrendingUp;
      case 'business': return Building2;
      default: return Wallet;
    }
  };

  const getWalletColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-700';
      case 'savings': return 'bg-green-100 text-green-700';
      case 'crypto': return 'bg-orange-100 text-orange-700';
      case 'investment': return 'bg-purple-100 text-purple-700';
      case 'business': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const handleWalletAction = (action: string, walletId: number) => {
    toast({
      title: `${action} Action`,
      description: `${action} functionality coming soon for wallet ${walletId}`,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <main className="max-w-md mx-auto px-4 pb-20">
        {/* Total Portfolio Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Total Portfolio</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
              >
                {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {showBalances ? formatCurrency(totalNetWorth) : "****"}
                </p>
                <p className="text-neutral-600">Total Net Worth</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    {showBalances ? formatCurrency(totalFiatBalance) : "****"}
                  </p>
                  <p className="text-sm text-neutral-600">Cash Balance</p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    {showBalances ? formatCurrency(totalCryptoValue) : "****"}
                  </p>
                  <p className="text-sm text-neutral-600">Crypto Value</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    {showBalances ? formatCurrency(totalInvestmentValue) : "****"}
                  </p>
                  <p className="text-sm text-neutral-600">Investments</p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    {showBalances ? formatCurrency(totalCreditAvailable) : "****"}
                  </p>
                  <p className="text-sm text-neutral-600">Available Credit</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="wallets" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="investments">Invest</TabsTrigger>
            <TabsTrigger value="credit">Credit</TabsTrigger>
          </TabsList>

          <TabsContent value="wallets" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Wallets</h2>
              <Button size="sm" onClick={() => handleWalletAction("Create", 0)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>

            <div className="space-y-3">
              {wallets.map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                const colorClass = getWalletColor(wallet.walletType);
                
                return (
                  <Card key={wallet.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {wallet.walletType.replace('_', ' ')} Wallet
                            </p>
                            <p className="text-sm text-neutral-600">
                              {wallet.currency} • ID: {wallet.id}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="font-semibold">
                              {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "****"}
                            </p>
                            {parseFloat(wallet.pendingBalance || "0") > 0 && (
                              <p className="text-xs text-orange-600">
                                +{formatCurrency(wallet.pendingBalance, wallet.currency)} pending
                              </p>
                            )}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleWalletAction("Send", wallet.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Money
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleWalletAction("Receive", wallet.id)}>
                                <ArrowDownToLine className="w-4 h-4 mr-2" />
                                Receive Money
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleWalletAction("Topup", wallet.id)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Top Up
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Crypto Holdings</h2>
              <Button size="sm" onClick={() => handleWalletAction("Buy Crypto", 0)}>
                <Plus className="w-4 h-4 mr-2" />
                Buy Crypto
              </Button>
            </div>

            <div className="space-y-3">
              {holdings.filter(h => h.asset.type === 'cryptocurrency').map((holding) => {
                const value = parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate);
                const gain = value - parseFloat(holding.totalInvested);
                const gainPercent = (gain / parseFloat(holding.totalInvested)) * 100;
                
                return (
                  <Card key={holding.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Bitcoin className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">{holding.asset.symbol}</p>
                            <p className="text-sm text-neutral-600">{holding.asset.name}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {showBalances ? formatCurrency(value) : "****"}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {showBalances ? `${parseFloat(holding.balance).toFixed(6)} ${holding.asset.symbol}` : "****"}
                          </p>
                          <Badge variant={gain >= 0 ? "default" : "destructive"} className="text-xs">
                            {showBalances ? `${gain >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%` : "****"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Investments</h2>
              <Button size="sm" onClick={() => handleWalletAction("New Investment", 0)}>
                <Plus className="w-4 h-4 mr-2" />
                Invest
              </Button>
            </div>

            <div className="space-y-3">
              {investments.map((investment) => {
                const gain = parseFloat(investment.currentValue) - parseFloat(investment.principalAmount);
                const gainPercent = (gain / parseFloat(investment.principalAmount)) * 100;
                
                return (
                  <Card key={investment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{investment.product.name}</p>
                            <p className="text-sm text-neutral-600">{investment.product.type}</p>
                            <Badge variant="outline" className="text-xs">
                              {investment.product.riskLevel} Risk
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {showBalances ? formatCurrency(investment.currentValue) : "****"}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Principal: {showBalances ? formatCurrency(investment.principalAmount) : "****"}
                          </p>
                          <Badge variant={gain >= 0 ? "default" : "destructive"} className="text-xs">
                            {showBalances ? `${gain >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%` : "****"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Credit Facilities</h2>
              <Button size="sm" onClick={() => handleWalletAction("Apply Credit", 0)}>
                <Plus className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>

            <div className="space-y-3">
              {creditFacilities.map((facility) => {
                const utilizationPercent = (parseFloat(facility.usedCredit) / parseFloat(facility.creditLimit)) * 100;
                
                return (
                  <Card key={facility.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">{facility.type.replace('_', ' ')}</p>
                            <p className="text-sm text-neutral-600">
                              {facility.interestRate}% APR
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {showBalances ? formatCurrency(facility.availableCredit) : "****"}
                          </p>
                          <p className="text-sm text-neutral-600">Available</p>
                          <Badge variant={facility.status === 'active' ? 'default' : 'secondary'}>
                            {facility.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Credit Utilization</span>
                          <span>{showBalances ? `${utilizationPercent.toFixed(1)}%` : "****"}</span>
                        </div>
                        <Progress value={utilizationPercent} className="h-2" />
                        <div className="flex justify-between text-xs text-neutral-600">
                          <span>Used: {showBalances ? formatCurrency(facility.usedCredit) : "****"}</span>
                          <span>Limit: {showBalances ? formatCurrency(facility.creditLimit) : "****"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation currentPage="wallets" />
    </div>
  );
}