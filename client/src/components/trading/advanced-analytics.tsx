import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Calendar,
  DollarSign,
  Target,
  AlertTriangle,
  Zap,
  Brain
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface PerformanceMetrics {
  totalTrades: number;
  successRate: number;
  totalProfit: number;
  averageProfit: number;
  bestTrade: number;
  worstTrade: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface CurrencyAnalysis {
  currency: string;
  tradingVolume: number;
  profitability: number;
  volatility: number;
  opportunityCount: number;
  riskScore: number;
}

interface MarketTrend {
  timeframe: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  confidence: number;
  keyLevels: {
    support: number;
    resistance: number;
  };
}

interface PredictiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend';
  message: string;
  confidence: number;
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
}

export default function AdvancedAnalytics() {
  const [timeframe, setTimeframe] = useState("7d");
  const [selectedCurrency, setSelectedCurrency] = useState("all");

  // Mock performance data
  const performanceMetrics: PerformanceMetrics = {
    totalTrades: 247,
    successRate: 78.5,
    totalProfit: 12547.85,
    averageProfit: 50.80,
    bestTrade: 1250.75,
    worstTrade: -89.25,
    sharpeRatio: 2.34,
    maxDrawdown: 5.2
  };

  const currencyAnalysis: CurrencyAnalysis[] = [
    {
      currency: "USD/EUR",
      tradingVolume: 2547893.50,
      profitability: 68.5,
      volatility: 12.3,
      opportunityCount: 45,
      riskScore: 3.2
    },
    {
      currency: "USD/GBP", 
      tradingVolume: 1893745.25,
      profitability: 72.1,
      volatility: 15.7,
      opportunityCount: 38,
      riskScore: 3.8
    },
    {
      currency: "USD/NGN",
      tradingVolume: 845932.75,
      profitability: 81.2,
      volatility: 28.4,
      opportunityCount: 67,
      riskScore: 6.1
    },
    {
      currency: "USD/KES",
      tradingVolume: 634821.50,
      profitability: 75.9,
      volatility: 22.1,
      opportunityCount: 52,
      riskScore: 4.9
    },
    {
      currency: "EUR/GBP",
      tradingVolume: 1247583.25,
      profitability: 69.3,
      volatility: 11.8,
      opportunityCount: 31,
      riskScore: 2.9
    }
  ];

  const marketTrends: MarketTrend[] = [
    {
      timeframe: "1H",
      trend: 'bullish',
      strength: 78,
      confidence: 85,
      keyLevels: { support: 0.8520, resistance: 0.8580 }
    },
    {
      timeframe: "4H",
      trend: 'neutral',
      strength: 45,
      confidence: 72,
      keyLevels: { support: 0.8500, resistance: 0.8600 }
    },
    {
      timeframe: "1D",
      trend: 'bearish',
      strength: 62,
      confidence: 79,
      keyLevels: { support: 0.8450, resistance: 0.8550 }
    }
  ];

  const predictiveInsights: PredictiveInsight[] = [
    {
      id: "PRED_001",
      type: 'opportunity',
      message: "High probability arbitrage opportunity expected in USD/NGN pair within next 2 hours",
      confidence: 87,
      timeframe: "2h",
      impact: 'high'
    },
    {
      id: "PRED_002", 
      type: 'risk',
      message: "Increased volatility expected in GBP pairs due to economic announcement",
      confidence: 92,
      timeframe: "4h",
      impact: 'medium'
    },
    {
      id: "PRED_003",
      type: 'trend',
      message: "EUR strength trend likely to continue for next 24 hours",
      confidence: 74,
      timeframe: "24h",
      impact: 'medium'
    },
    {
      id: "PRED_004",
      type: 'opportunity',
      message: "Optimal execution window for triangular arbitrage detected in 45 minutes",
      confidence: 89,
      timeframe: "45m",
      impact: 'high'
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-success';
      case 'bearish': return 'text-destructive';
      case 'neutral': return 'text-neutral-600';
      default: return 'text-neutral-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingUp className="w-4 h-4 rotate-180" />;
      case 'neutral': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-4 h-4 text-success" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-accent" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-accent/10 text-accent';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Timeframe</label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Currency Pair</label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pairs</SelectItem>
              <SelectItem value="USD/EUR">USD/EUR</SelectItem>
              <SelectItem value="USD/GBP">USD/GBP</SelectItem>
              <SelectItem value="USD/NGN">USD/NGN</SelectItem>
              <SelectItem value="USD/KES">USD/KES</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Trades</p>
                    <p className="text-2xl font-bold">{performanceMetrics.totalTrades}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Success Rate</p>
                    <p className="text-2xl font-bold text-success">{formatPercentage(performanceMetrics.successRate)}</p>
                  </div>
                  <Target className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Profit</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(performanceMetrics.totalProfit)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Sharpe Ratio</p>
                    <p className="text-2xl font-bold">{performanceMetrics.sharpeRatio}</p>
                  </div>
                  <Activity className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Average Profit per Trade</span>
                      <span className="font-bold">{formatCurrency(performanceMetrics.averageProfit)}</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Best Trade</span>
                      <span className="font-bold text-success">{formatCurrency(performanceMetrics.bestTrade)}</span>
                    </div>
                    <Progress value={95} className="bg-success/20" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="font-bold text-destructive">{formatPercentage(performanceMetrics.maxDrawdown)}</span>
                    </div>
                    <Progress value={performanceMetrics.maxDrawdown * 10} className="bg-destructive/20" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Risk-Adjusted Returns</h4>
                    <p className="text-3xl font-bold text-primary">{performanceMetrics.sharpeRatio}</p>
                    <p className="text-sm text-neutral-600">Sharpe Ratio</p>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Win/Loss Ratio</h4>
                    <p className="text-3xl font-bold text-success">3.2:1</p>
                    <p className="text-sm text-neutral-600">Average Win vs Loss</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Pair Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currencyAnalysis.map((analysis) => (
                  <div key={analysis.currency} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{analysis.currency}</h4>
                        <p className="text-sm text-neutral-600">
                          {analysis.opportunityCount} opportunities
                        </p>
                      </div>
                      <Badge className="bg-success/10 text-success">
                        {formatPercentage(analysis.profitability)} profitable
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-neutral-600">Trading Volume</p>
                        <p className="font-medium">{formatCurrency(analysis.tradingVolume)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">Volatility</p>
                        <p className="font-medium">{formatPercentage(analysis.volatility)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">Risk Score</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={analysis.riskScore * 10} className="flex-1" />
                          <span className="text-xs">{analysis.riskScore}/10</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">Opportunities</p>
                        <p className="font-medium text-accent">{analysis.opportunityCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketTrends.map((trend) => (
                  <div key={trend.timeframe} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{trend.timeframe}</h4>
                      <div className={`flex items-center space-x-1 ${getTrendColor(trend.trend)}`}>
                        {getTrendIcon(trend.trend)}
                        <span className="capitalize font-medium">{trend.trend}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Trend Strength</span>
                          <span className="text-sm font-medium">{trend.strength}%</span>
                        </div>
                        <Progress value={trend.strength} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Confidence</span>
                          <span className="text-sm font-medium">{trend.confidence}%</span>
                        </div>
                        <Progress value={trend.confidence} className="bg-accent/20" />
                      </div>
                      
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Support:</span>
                          <span className="font-medium">{trend.keyLevels.support}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resistance:</span>
                          <span className="font-medium">{trend.keyLevels.resistance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI-Powered Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`text-xs capitalize ${getImpactColor(insight.impact)}`}>
                            {insight.impact} impact
                          </Badge>
                          <Badge className="text-xs bg-neutral-100">
                            {insight.timeframe}
                          </Badge>
                          <Badge className="text-xs bg-primary/10 text-primary">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-700 mb-3">{insight.message}</p>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {insight.type === 'opportunity' && (
                            <Button size="sm" className="bg-success hover:bg-success/90">
                              <Zap className="w-3 h-3 mr-1" />
                              Act Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}