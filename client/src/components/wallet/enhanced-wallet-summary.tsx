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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
                  {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Transfer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="investments">Invest</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Wallet Breakdown */}
          <div className="grid grid-cols-1 gap-4">
            {wallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getWalletIcon(wallet.walletType)}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{wallet.walletType} Wallet</p>
                        <p className="text-sm text-neutral-600">{wallet.currency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
                      <p className="text-xs text-neutral-600">
                        Limit: {formatCurrency(wallet.dailyLimit, wallet.currency)}/day
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Crypto Holdings</span>
                {cryptoWallet && (
                  <Badge>{formatCurrency(cryptoWallet.balance, cryptoWallet.currency)}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {holdings.filter(h => h.asset.type === 'cryptocurrency').length === 0 ? (
                <div className="text-center py-6">
                  <Bitcoin className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-3">No crypto holdings yet</p>
                  <Button 
                    onClick={() => toast({ title: "Crypto Trading", description: "Crypto trading coming soon!" })}
                  >
                    Buy Crypto
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {holdings
                    .filter(h => h.asset.type === 'cryptocurrency')
                    .map((holding) => (
                      <div key={holding.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">{holding.asset.symbol.slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{holding.asset.name}</p>
                            <p className="text-sm text-neutral-600">
                              {formatCrypto(holding.balance, holding.asset.symbol)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {formatCurrency(
                              parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate)
                            )}
                          </p>
                          <div className="flex items-center space-x-1">
                            {parseFloat(holding.asset.priceChange24h) >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-success" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-destructive" />
                            )}
                            <span className={`text-xs ${getPriceChangeColor(holding.asset.priceChange24h)}`}>
                              {holding.asset.priceChange24h}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Investments</span>
                <Badge>${totalInvestmentValue.toFixed(2)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investments.length === 0 ? (
                <div className="text-center py-6">
                  <LineChart className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-3">Start growing your wealth</p>
                  <Button 
                    onClick={() => toast({ title: "Investment", description: "Investment products coming soon!" })}
                  >
                    Explore Investments
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {investments.map((investment) => (
                    <div key={investment.id} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{investment.product.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className="text-xs capitalize">{investment.product.type}</Badge>
                            <Badge 
                              className={`text-xs ${
                                investment.product.riskLevel === 'low' ? 'bg-success/10 text-success' :
                                investment.product.riskLevel === 'medium' ? 'bg-accent/10 text-accent' :
                                'bg-destructive/10 text-destructive'
                              }`}
                            >
                              {investment.product.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(investment.currentValue)}</p>
                          <p className="text-xs text-success">
                            +{formatCurrency(investment.interestEarned)} earned
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-600">
                        Expected: {investment.product.expectedReturn}% annual return
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              {creditFacilities.length === 0 ? (
                <div className="text-center py-6">
                  <DollarSign className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600 mb-3">No credit facilities yet</p>
                  <Button 
                    onClick={() => toast({ title: "Credit", description: "Credit application coming soon!" })}
                  >
                    Apply for Credit
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {creditFacilities.map((facility) => (
                    <div key={facility.id} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium capitalize">{facility.type.replace('_', ' ')}</p>
                          <p className="text-sm text-neutral-600">
                            {facility.interestRate}% interest rate
                          </p>
                        </div>
                        <Badge 
                          className={facility.status === 'active' ? 'bg-success/10 text-success' : 'bg-neutral-100'}
                        >
                          {facility.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-600">Available</p>
                          <p className="font-bold text-success">{formatCurrency(facility.availableCredit)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Used</p>
                          <p className="font-bold">{formatCurrency(facility.usedCredit)}</p>
                        </div>
                      </div>
                      <div className="mt-2 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{
                            width: `${(parseFloat(facility.usedCredit) / parseFloat(facility.creditLimit)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}