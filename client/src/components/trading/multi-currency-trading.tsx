import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft, 
  Calculator,
  Target,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  DollarSign,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CurrencyPair {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  spread: number;
  volume24h: number;
  change24h: number;
  lastUpdated: string;
}

interface ArbitrageOpportunity {
  id: string;
  buyPair: string;
  sellPair: string;
  profitMargin: number;
  estimatedProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeWindow: number;
  requiredCapital: number;
}

interface TradeOrder {
  id: string;
  type: 'market' | 'limit' | 'arbitrage';
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  status: 'pending' | 'executed' | 'cancelled';
  profit?: number;
  timestamp: string;
}

export default function MultiCurrencyTrading() {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(null);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [limitRate, setLimitRate] = useState("");
  const [autoArbitrage, setAutoArbitrage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - in production this would come from real-time APIs
  const mockCurrencyPairs: CurrencyPair[] = [
    {
      id: "USD_EUR",
      baseCurrency: "USD",
      quoteCurrency: "EUR",
      rate: 0.8542,
      spread: 0.0012,
      volume24h: 2547893.50,
      change24h: -0.23,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "USD_GBP",
      baseCurrency: "USD",
      quoteCurrency: "GBP",
      rate: 0.7834,
      spread: 0.0018,
      volume24h: 1893745.25,
      change24h: 0.45,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "USD_NGN",
      baseCurrency: "USD",
      quoteCurrency: "NGN",
      rate: 461.25,
      spread: 2.5,
      volume24h: 845932.75,
      change24h: -1.2,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "USD_KES",
      baseCurrency: "USD",
      quoteCurrency: "KES",
      rate: 149.75,
      spread: 1.25,
      volume24h: 634821.50,
      change24h: 0.8,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "EUR_GBP",
      baseCurrency: "EUR",
      quoteCurrency: "GBP",
      rate: 0.9171,
      spread: 0.0015,
      volume24h: 1247583.25,
      change24h: 0.67,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "GBP_NGN",
      baseCurrency: "GBP",
      quoteCurrency: "NGN",
      rate: 588.92,
      spread: 3.2,
      volume24h: 423659.75,
      change24h: -0.95,
      lastUpdated: new Date().toISOString()
    }
  ];

  const mockArbitrageOpportunities: ArbitrageOpportunity[] = [
    {
      id: "ARB_001",
      buyPair: "USD/EUR",
      sellPair: "EUR/GBP",
      profitMargin: 0.24,
      estimatedProfit: 120.50,
      riskLevel: 'low',
      timeWindow: 45,
      requiredCapital: 50000
    },
    {
      id: "ARB_002",
      buyPair: "USD/NGN",
      sellPair: "NGN/EUR",
      profitMargin: 0.67,
      estimatedProfit: 335.25,
      riskLevel: 'medium',
      timeWindow: 23,
      requiredCapital: 50000
    },
    {
      id: "ARB_003",
      buyPair: "GBP/USD",
      sellPair: "USD/KES",
      profitMargin: 0.18,
      estimatedProfit: 90.75,
      riskLevel: 'low',
      timeWindow: 67,
      requiredCapital: 50000
    }
  ];

  const { data: recentTrades = [] } = useQuery<TradeOrder[]>({
    queryKey: ["/api/trading/orders"],
  });

  const executeTradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      await apiRequest("POST", "/api/trading/execute", tradeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading/orders"] });
      toast({
        title: "Trade Executed",
        description: "Your currency trade has been executed successfully",
      });
      setAmount("");
      setLimitRate("");
    },
    onError: () => {
      toast({
        title: "Trade Failed",
        description: "Failed to execute trade",
        variant: "destructive",
      });
    },
  });

  const executeArbitrageMutation = useMutation({
    mutationFn: async (arbData: any) => {
      await apiRequest("POST", "/api/trading/arbitrage", arbData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading/orders"] });
      toast({
        title: "Arbitrage Executed",
        description: "Arbitrage opportunity has been executed",
      });
    },
    onError: () => {
      toast({
        title: "Arbitrage Failed",
        description: "Failed to execute arbitrage trade",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'limit' && (!limitRate || parseFloat(limitRate) <= 0)) {
      toast({
        title: "Invalid Rate",
        description: "Please enter a valid exchange rate",
        variant: "destructive",
      });
      return;
    }

    const currentPair = mockCurrencyPairs.find(p => 
      p.baseCurrency === fromCurrency && p.quoteCurrency === toCurrency
    );

    executeTradeMutation.mutate({
      type: orderType,
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      rate: orderType === 'limit' ? parseFloat(limitRate) : currentPair?.rate,
    });
  };

  const handleArbitrageExecution = (opportunity: ArbitrageOpportunity) => {
    executeArbitrageMutation.mutate({
      opportunityId: opportunity.id,
      amount: opportunity.requiredCapital,
    });
  };

  const getCurrentRate = () => {
    return mockCurrencyPairs.find(p => 
      p.baseCurrency === fromCurrency && p.quoteCurrency === toCurrency
    )?.rate || 1;
  };

  const calculateConversion = () => {
    if (!amount) return 0;
    return parseFloat(amount) * getCurrentRate();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-accent';
      case 'high': return 'text-destructive';
      default: return 'text-neutral-600';
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'NGN' || currency === 'KES' ? 2 : 4,
    }).format(value);
  };

  const formatRate = (rate: number) => {
    return rate < 1 ? rate.toFixed(4) : rate.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ArrowRightLeft className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Multi-Currency Trading</h2>
        <p className="text-neutral-600">Advanced currency exchange and arbitrage tools</p>
      </div>

      <Tabs defaultValue="trading" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="rates">Live Rates</TabsTrigger>
          <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Currency Exchange</span>
                <Button onClick={handleRefresh} size="sm" disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">From</label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">To</label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Amount ({fromCurrency})</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={orderType === 'limit'}
                    onCheckedChange={(checked) => setOrderType(checked ? 'limit' : 'market')}
                  />
                  <span className="text-sm">Limit Order</span>
                </div>
                {orderType === 'limit' && (
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={`Rate (current: ${formatRate(getCurrentRate())})`}
                      value={limitRate}
                      onChange={(e) => setLimitRate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {amount && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-600">Current Rate</span>
                    <span className="font-medium">1 {fromCurrency} = {formatRate(getCurrentRate())} {toCurrency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">You will receive</span>
                    <span className="font-bold text-lg">{calculateConversion().toFixed(2)} {toCurrency}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleTrade}
                disabled={executeTradeMutation.isPending || !amount}
                className="w-full"
              >
                {executeTradeMutation.isPending ? "Executing..." : "Execute Trade"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Exchange Rates</span>
                <Badge className="bg-success/10 text-success">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCurrencyPairs.map((pair) => (
                  <div key={pair.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium">{pair.baseCurrency}/{pair.quoteCurrency}</p>
                      <p className="text-sm text-neutral-600">
                        Vol: {formatCurrency(pair.volume24h, "USD")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatRate(pair.rate)}</p>
                      <div className={`flex items-center space-x-1 text-sm ${pair.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {pair.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{pair.change24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arbitrage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Arbitrage Opportunities</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={autoArbitrage}
                    onCheckedChange={setAutoArbitrage}
                  />
                  <span className="text-sm">Auto Execute</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockArbitrageOpportunities.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No arbitrage opportunities found</p>
                  <p className="text-sm text-neutral-500">Check back in a few minutes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockArbitrageOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">{opportunity.buyPair} → {opportunity.sellPair}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs ${getRiskColor(opportunity.riskLevel)}`}>
                              {opportunity.riskLevel} risk
                            </Badge>
                            <Badge className="text-xs bg-accent/10 text-accent">
                              <Timer className="w-3 h-3 mr-1" />
                              {opportunity.timeWindow}s window
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-success">+{opportunity.profitMargin}%</p>
                          <p className="text-sm text-neutral-600">{formatCurrency(opportunity.estimatedProfit, "USD")} profit</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-neutral-600">Required Capital</p>
                          <p className="font-medium">{formatCurrency(opportunity.requiredCapital, "USD")}</p>
                        </div>
                        <div>
                          <p className="text-neutral-600">Est. Return</p>
                          <p className="font-medium text-success">{formatCurrency(opportunity.estimatedProfit, "USD")}</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleArbitrageExecution(opportunity)}
                        disabled={executeArbitrageMutation.isPending}
                        className="w-full bg-success hover:bg-success/90"
                        size="sm"
                      >
                        {executeArbitrageMutation.isPending ? "Executing..." : "Execute Arbitrage"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading History</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTrades.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No trading history yet</p>
                  <p className="text-sm text-neutral-500">Your trades will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="font-medium">{trade.fromCurrency} → {trade.toCurrency}</p>
                        <p className="text-sm text-neutral-600">
                          {trade.amount} {trade.fromCurrency} @ {formatRate(trade.rate)}
                        </p>
                        <p className="text-xs text-neutral-500">{new Date(trade.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={
                            trade.status === 'executed' ? 'bg-success/10 text-success' :
                            trade.status === 'pending' ? 'bg-accent/10 text-accent' :
                            'bg-destructive/10 text-destructive'
                          }
                        >
                          {trade.status}
                        </Badge>
                        {trade.profit && (
                          <p className="text-sm text-success mt-1">
                            +{formatCurrency(trade.profit, "USD")}
                          </p>
                        )}
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