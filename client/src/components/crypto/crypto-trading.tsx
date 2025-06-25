import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  DollarSign,
  Plus,
  Minus,
  BarChart3
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CryptoAsset {
  id: number;
  symbol: string;
  name: string;
  type: string;
  exchangeRate: string;
  priceChange24h: string;
  volume24h: string;
  marketCap: string;
}

interface TradingPair {
  id: number;
  symbol: string;
  lastPrice: string;
  volume24h: string;
  priceChange24h: string;
  baseAsset: CryptoAsset;
  quoteAsset: CryptoAsset;
}

export default function CryptoTrading() {
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cryptoAssets = [] } = useQuery<CryptoAsset[]>({
    queryKey: ["/api/digital-assets"],
  });

  const { data: tradingPairs = [] } = useQuery<TradingPair[]>({
    queryKey: ["/api/trading-pairs"],
  });

  const { data: portfolio = [] } = useQuery({
    queryKey: ["/api/wallets/holdings"],
  });

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      await apiRequest("POST", "/api/crypto/trade", tradeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets/holdings"] });
      toast({
        title: "Trade Executed",
        description: `${orderType} order completed successfully`,
      });
      setAmount("");
      setPrice("");
    },
    onError: () => {
      toast({
        title: "Trade Failed",
        description: "Failed to execute trade",
        variant: "destructive",
      });
    },
  });

  const cryptoCoins = cryptoAssets.filter(asset => asset.type === 'cryptocurrency');

  const getPriceChangeColor = (change: string) => {
    const value = parseFloat(change);
    if (value > 0) return "text-success";
    if (value < 0) return "text-destructive";
    return "text-neutral-600";
  };

  const getPriceChangeIcon = (change: string) => {
    const value = parseFloat(change);
    if (value > 0) return <TrendingUp className="w-3 h-3" />;
    if (value < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const handleTrade = () => {
    if (!selectedPair || !amount || !price) {
      toast({
        title: "Invalid Trade",
        description: "Please fill in all trade details",
        variant: "destructive",
      });
      return;
    }

    tradeMutation.mutate({
      pairId: selectedPair.id,
      type: orderType,
      amount: parseFloat(amount),
      price: parseFloat(price),
    });
  };

  const formatCurrency = (value: string, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
    }).format(parseFloat(value));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bitcoin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Crypto Trading</h2>
        <p className="text-neutral-600">Buy and sell cryptocurrencies</p>
      </div>

      <Tabs defaultValue="markets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cryptocurrency Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cryptoCoins.map((asset) => (
                  <div 
                    key={asset.id} 
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer"
                    onClick={() => {
                      const pair = tradingPairs.find(p => p.baseAsset.symbol === asset.symbol);
                      if (pair) setSelectedPair(pair);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-neutral-600">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(asset.exchangeRate)}</p>
                      <div className={`flex items-center space-x-1 text-sm ${getPriceChangeColor(asset.priceChange24h)}`}>
                        {getPriceChangeIcon(asset.priceChange24h)}
                        <span>{asset.priceChange24h}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trading Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tradingPairs.map((pair) => (
                  <div 
                    key={pair.id} 
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer"
                    onClick={() => setSelectedPair(pair)}
                  >
                    <div>
                      <p className="font-medium">{pair.symbol}</p>
                      <p className="text-sm text-neutral-600">Vol: ${parseFloat(pair.volume24h).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(pair.lastPrice, 8)}</p>
                      <div className={`flex items-center space-x-1 text-sm ${getPriceChangeColor(pair.priceChange24h)}`}>
                        {getPriceChangeIcon(pair.priceChange24h)}
                        <span>{pair.priceChange24h}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trade" className="space-y-4">
          {selectedPair ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedPair.symbol}</span>
                    <Badge>{formatCurrency(selectedPair.lastPrice, 8)}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-600">24h Change</p>
                      <p className={`font-bold ${getPriceChangeColor(selectedPair.priceChange24h)}`}>
                        {selectedPair.priceChange24h}%
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600">24h Volume</p>
                      <p className="font-bold">${parseFloat(selectedPair.volume24h).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Place Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      variant={orderType === 'buy' ? 'default' : 'outline'}
                      className={orderType === 'buy' ? 'bg-success text-white' : ''}
                      onClick={() => setOrderType('buy')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                    <Button
                      variant={orderType === 'sell' ? 'default' : 'outline'}
                      className={orderType === 'sell' ? 'bg-destructive text-white' : ''}
                      onClick={() => setOrderType('sell')}
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      Sell
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Amount ({selectedPair.baseAsset.symbol})</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Price ({selectedPair.quoteAsset.symbol})</label>
                    <Input
                      type="number"
                      placeholder={selectedPair.lastPrice}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  {amount && price && (
                    <div className="bg-neutral-50 rounded-lg p-3">
                      <p className="text-sm text-neutral-600 mb-1">Total</p>
                      <p className="font-bold text-lg">
                        {formatCurrency((parseFloat(amount) * parseFloat(price)).toString())}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleTrade}
                    disabled={tradeMutation.isPending || !amount || !price}
                    className={`w-full ${orderType === 'buy' ? 'bg-success' : 'bg-destructive'}`}
                  >
                    {tradeMutation.isPending ? "Executing..." : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedPair.baseAsset.symbol}`}
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <ArrowUpDown className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600">Select a trading pair to start trading</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crypto Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.filter((holding: any) => holding.asset?.type === 'cryptocurrency').length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-600">No crypto holdings yet</p>
                  <p className="text-sm text-neutral-500 mt-1">Start trading to build your portfolio</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio
                    .filter((holding: any) => holding.asset?.type === 'cryptocurrency')
                    .map((holding: any) => {
                      const currentValue = parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate);
                      const pnl = currentValue - parseFloat(holding.totalInvested || "0");
                      const pnlPercentage = ((pnl / parseFloat(holding.totalInvested || "1")) * 100);

                      return (
                        <div key={holding.id} className="p-4 bg-neutral-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{holding.asset.name}</p>
                              <p className="text-sm text-neutral-600">{holding.balance} {holding.asset.symbol}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(currentValue.toString())}</p>
                              <div className={`text-sm ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {pnl >= 0 ? '+' : ''}{formatCurrency(pnl.toString())} ({pnlPercentage.toFixed(2)}%)
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs text-neutral-600">
                            <div>
                              <p>Avg. Buy Price</p>
                              <p className="font-medium">{formatCurrency(holding.averageBuyPrice || "0")}</p>
                            </div>
                            <div>
                              <p>Total Invested</p>
                              <p className="font-medium">{formatCurrency(holding.totalInvested || "0")}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}