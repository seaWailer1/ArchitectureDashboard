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

export default function WalletsRefined() {
  const [showBalances, setShowBalances] = useState(true);
  const { toast } = useToast();

  const { data: wallets = [] } = useQuery<WalletData[]>({
    queryKey: ["/api/wallets"],
  });

  const totalNetWorth = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);
  const totalFiatBalance = wallets
    .filter(w => ['primary', 'savings'].includes(w.walletType))
    .reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);
  const totalCryptoValue = wallets
    .filter(w => w.walletType === 'crypto')
    .reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);

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

  const handleWalletAction = (action: string, walletId: number) => {
    toast({
      title: `${action} Action`,
      description: `${action} functionality coming soon for wallet ${walletId}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <AppHeader />
      
      <main className="container-content spacing-y-lg pb-24">
        {/* Total Portfolio Overview */}
        <Card className="card-refined elevation-2 spacing-lg bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
          <CardHeader className="spacing-y-sm">
            <CardTitle className="flex items-center justify-between">
              <span className="text-heading-2 text-refined-heading">Total Portfolio</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
                className="touch-aaa rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 focus-aaa"
              >
                {showBalances ? 
                  <EyeOff className="w-5 h-5 text-neutral-600" aria-label="Hide balances" /> : 
                  <Eye className="w-5 h-5 text-neutral-600" aria-label="Show balances" />
                }
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-refined-heading tracking-tight">
                {showBalances ? formatCurrency(totalNetWorth) : "••••••"}
              </div>
              <div className="text-refined-muted">Total Net Worth</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {showBalances ? formatCurrency(totalFiatBalance) : "••••"}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Cash Balance</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {showBalances ? formatCurrency(totalCryptoValue) : "••••"}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Crypto Value</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl shadow-soft">
            <TabsTrigger value="primary" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">
              Primary
            </TabsTrigger>
            <TabsTrigger value="crypto" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">
              Crypto
            </TabsTrigger>
            <TabsTrigger value="savings" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">
              Savings
            </TabsTrigger>
            <TabsTrigger value="investment" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">
              Investment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="primary" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Primary Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Primary", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>

            <div className="space-y-4">
              {wallets.filter(w => w.walletType === 'primary').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                
                return (
                  <Card key={wallet.id} className="card-refined interactive-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center shadow-soft">
                            <Icon className="w-7 h-7 text-blue-700 dark:text-blue-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-refined-heading text-lg">
                              {wallet.walletType.charAt(0).toUpperCase() + wallet.walletType.slice(1)} Wallet
                            </h3>
                            <div className="text-refined-muted text-sm">
                              {wallet.currency} • Created {new Date(wallet.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold text-refined-heading">
                            {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "••••••"}
                          </div>
                          {parseFloat(wallet.pendingBalance) > 0 && (
                            <div className="text-sm text-muted-foreground">
                              +{showBalances ? formatCurrency(wallet.pendingBalance, wallet.currency) : "••••"} pending
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Send", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Send
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Receive", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <ArrowDownToLine className="w-3 h-3 mr-1" />
                              Receive
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Crypto Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Crypto", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>

            <div className="space-y-4">
              {wallets.filter(w => w.walletType === 'crypto').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                
                return (
                  <Card key={wallet.id} className="card-refined interactive-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-2xl flex items-center justify-center shadow-soft">
                            <Icon className="w-7 h-7 text-orange-700 dark:text-orange-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-refined-heading text-lg">Crypto Wallet</h3>
                            <div className="text-refined-muted text-sm">
                              {wallet.currency} • Digital assets
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <p className="text-2xl font-bold text-refined-heading">
                            {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "••••••"}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Buy", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Buy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Sell", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <ArrowDownToLine className="w-3 h-3 mr-1" />
                              Sell
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Savings Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Savings", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Savings
              </Button>
            </div>

            <div className="space-y-4">
              {wallets.filter(w => w.walletType === 'savings').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                
                return (
                  <Card key={wallet.id} className="card-refined interactive-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center shadow-soft">
                            <Icon className="w-7 h-7 text-green-700 dark:text-green-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-refined-heading text-lg">Savings Wallet</h3>
                            <p className="text-refined-muted text-sm">
                              {wallet.currency} • Goal-based savings
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <p className="text-2xl font-bold text-refined-heading">
                            {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "••••••"}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Deposit", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Deposit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Withdraw", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <ArrowDownToLine className="w-3 h-3 mr-1" />
                              Withdraw
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="investment" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Investment Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Investment", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Investment
              </Button>
            </div>

            <div className="space-y-4">
              {wallets.filter(w => w.walletType === 'investment').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                
                return (
                  <Card key={wallet.id} className="card-refined interactive-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl flex items-center justify-center shadow-soft">
                            <Icon className="w-7 h-7 text-purple-700 dark:text-purple-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-refined-heading text-lg">Investment Wallet</h3>
                            <p className="text-refined-muted text-sm">
                              {wallet.currency} • Portfolio funds
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <p className="text-2xl font-bold text-refined-heading">
                            {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "••••••"}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Invest", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Invest
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Add Funds", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Funds
                            </Button>
                          </div>
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