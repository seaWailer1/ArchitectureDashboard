import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  FaSearch, 
  Target, 
  FaTrendingUp, 
  FaClock, 
  FaDollarSign,
  FaExclamationTriangle,
  FaBolt,
  Calculator,
  BarChart3,
  Settings
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface ArbitrageOpportunity {
  id: string;
  type: 'triangular' | 'cross_exchange' | 'temporal';
  route: string[];
  profitMargin: number;
  estimatedProfit: number;
  requiredCapital: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeWindow: number;
  liquidityScore: number;
  volatilityRisk: number;
  executionComplexity: 'simple' | 'moderate' | 'complex';
  lastUpdated: string;
}

interface ScannerSettings {
  minProfitMargin: number;
  maxRisk: 'low' | 'medium' | 'high';
  minCapital: number;
  maxCapital: number;
  autoScan: boolean;
  scanInterval: number;
}

export default function ArbitrageScanner() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scanning, setScanning] = useState(false);
  const [settings, setSettings] = useState<ScannerSettings>({
    minProfitMargin: 0.1,
    maxRisk: 'medium',
    minCapital: 1000,
    maxCapital: 100000,
    autoScan: false,
    scanInterval: 30
  });

  // Mock arbitrage opportunities
  const mockOpportunities: ArbitrageOpportunity[] = [
    {
      id: "ARB_TRI_001",
      type: 'triangular',
      route: ['USD', 'EUR', 'GBP', 'USD'],
      profitMargin: 0.34,
      estimatedProfit: 170.25,
      requiredCapital: 50000,
      riskLevel: 'low',
      timeWindow: 45,
      liquidityScore: 95,
      volatilityRisk: 12,
      executionComplexity: 'simple',
      lastUpdated: new Date().toISOString()
    },
    {
      id: "ARB_CROSS_001",
      type: 'cross_exchange',
      route: ['USD', 'NGN'],
      profitMargin: 0.67,
      estimatedProfit: 335.50,
      requiredCapital: 50000,
      riskLevel: 'medium',
      timeWindow: 23,
      liquidityScore: 78,
      volatilityRisk: 28,
      executionComplexity: 'moderate',
      lastUpdated: new Date().toISOString()
    },
    {
      id: "ARB_TRI_002",
      type: 'triangular',
      route: ['EUR', 'GBP', 'KES', 'EUR'],
      profitMargin: 0.89,
      estimatedProfit: 445.75,
      requiredCapital: 50000,
      riskLevel: 'high',
      timeWindow: 18,
      liquidityScore: 65,
      volatilityRisk: 42,
      executionComplexity: 'complex',
      lastUpdated: new Date().toISOString()
    },
    {
      id: "ARB_TEMP_001",
      type: 'temporal',
      route: ['USD', 'EUR'],
      profitMargin: 0.15,
      estimatedProfit: 75.25,
      requiredCapital: 50000,
      riskLevel: 'low',
      timeWindow: 120,
      liquidityScore: 92,
      volatilityRisk: 8,
      executionComplexity: 'simple',
      lastUpdated: new Date().toISOString()
    },
    {
      id: "ARB_CROSS_002",
      type: 'cross_exchange',
      route: ['GBP', 'NGN'],
      profitMargin: 1.23,
      estimatedProfit: 615.75,
      requiredCapital: 50000,
      riskLevel: 'high',
      timeWindow: 12,
      liquidityScore: 52,
      volatilityRisk: 55,
      executionComplexity: 'complex',
      lastUpdated: new Date().toISOString()
    }
  ];

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = searchTerm === "" || 
      opp.route.some(currency => currency.toLowerCase().includes(searchTerm.toLowerCase())) ||
      opp.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfit = opp.profitMargin >= settings.minProfitMargin;
    const matchesRisk = (
      settings.maxRisk === 'high' ||
      (settings.maxRisk === 'medium' && opp.riskLevel !== 'high') ||
      (settings.maxRisk === 'low' && opp.riskLevel === 'low')
    );
    const matchesCapital = opp.requiredCapital >= settings.minCapital && opp.requiredCapital <= settings.maxCapital;

    return matchesSearch && matchesProfit && matchesRisk && matchesCapital;
  });

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'triangular': return <Target className="w-4 h-4" />;
      case 'cross_exchange': return <BarChart3 className="w-4 h-4" />;
      case 'temporal': return <FaClock className="w-4 h-4" />;
      default: return <FaSearch className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'triangular': return 'bg-blue-100 text-blue-700';
      case 'cross_exchange': return 'bg-purple-100 text-purple-700';
      case 'temporal': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success/10 text-success';
      case 'medium': return 'bg-accent/10 text-accent';
      case 'high': return 'bg-destructive/10 text-destructive';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-success';
      case 'moderate': return 'text-accent';
      case 'complex': return 'text-destructive';
      default: return 'text-neutral-600';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Scanner Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FaSearch className="w-5 h-5" />
            <span>Arbitrage Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="FaSearch currencies or opportunity types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleScan} disabled={scanning}>
              {scanning ? (
                <>
                  <FaSearch className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <FaSearch className="w-4 h-4 mr-2" />
                  Scan Now
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Min Profit %</label>
              <Input
                type="number"
                step="0.01"
                value={settings.minProfitMargin}
                onChange={(e) => setSettings({...settings, minProfitMargin: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Risk</label>
              <Select value={settings.maxRisk} onValueChange={(value: any) => setSettings({...settings, maxRisk: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Min Capital</label>
              <Input
                type="number"
                value={settings.minCapital}
                onChange={(e) => setSettings({...settings, minCapital: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                checked={settings.autoScan}
                onCheckedChange={(checked) => setSettings({...settings, autoScan: checked})}
              />
              <span className="text-sm">Auto Scan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Opportunities</p>
                <p className="text-2xl font-bold">{filteredOpportunities.length}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Best Profit</p>
                <p className="text-2xl font-bold text-success">
                  {Math.max(...filteredOpportunities.map(o => o.profitMargin)).toFixed(2)}%
                </p>
              </div>
              <FaTrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Avg Time Window</p>
                <p className="text-2xl font-bold">
                  {Math.round(filteredOpportunities.reduce((sum, o) => sum + o.timeWindow, 0) / filteredOpportunities.length || 0)}s
                </p>
              </div>
              <FaClock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Potential</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(filteredOpportunities.reduce((sum, o) => sum + o.estimatedProfit, 0))}
                </p>
              </div>
              <FaDollarSign className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Opportunities ({filteredOpportunities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-8">
              <FaSearch className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">No opportunities found</p>
              <p className="text-sm text-neutral-500">Try adjusting your filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(opportunity.type)}`}>
                        {getTypeIcon(opportunity.type)}
                      </div>
                      <div>
                        <p className="font-medium">{opportunity.route.join(' → ')}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${getTypeColor(opportunity.type)}`}>
                            {opportunity.type.replace('_', ' ')}
                          </Badge>
                          <Badge className={`text-xs ${getRiskColor(opportunity.riskLevel)}`}>
                            {opportunity.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-success">+{opportunity.profitMargin}%</p>
                      <p className="text-sm text-neutral-600">{formatCurrency(opportunity.estimatedProfit)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-neutral-600">Required Capital</p>
                      <p className="font-medium">{formatCurrency(opportunity.requiredCapital)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Time Window</p>
                      <p className="font-medium">{opportunity.timeWindow}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Liquidity Score</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={opportunity.liquidityScore} className="flex-1" />
                        <span className="text-xs">{opportunity.liquidityScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Complexity</p>
                      <p className={`font-medium capitalize ${getComplexityColor(opportunity.executionComplexity)}`}>
                        {opportunity.executionComplexity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-neutral-600">
                      <span>Volatility Risk: {opportunity.volatilityRisk}%</span>
                      <span>Updated: {new Date(opportunity.lastUpdated).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Calculator className="w-3 h-3 mr-1" />
                        Analyze
                      </Button>
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <FaBolt className="w-3 h-3 mr-1" />
                        Execute
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}