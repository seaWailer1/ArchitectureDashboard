import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
  Eye,
  RefreshCw,
  Settings,
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DemoDataManager from "@/components/admin/demo-data-manager";

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalVolume: string;
  activeWallets: number;
  kycPending: number;
  kycVerified: number;
  recentSignups: number;
  systemHealth: {
    database: 'healthy' | 'warning' | 'error';
    api: 'healthy' | 'warning' | 'error';
    payments: 'healthy' | 'warning' | 'error';
  };
}

interface UserMetrics {
  consumers: number;
  merchants: number;
  agents: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
}

interface TransactionMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageTransactionValue: string;
  topMerchants: Array<{
    id: string;
    name: string;
    volume: string;
    transactions: number;
  }>;
}

interface FinancialMetrics {
  totalWalletBalance: string;
  totalInvestments: string;
  totalCreditIssued: string;
  cryptoHoldings: string;
  revenueToday: string;
  revenueMonth: string;
}

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in production this would come from real APIs
  const mockStats: AdminStats = {
    totalUsers: 12847,
    totalTransactions: 45632,
    totalVolume: "2847392.50",
    activeWallets: 11203,
    kycPending: 847,
    kycVerified: 9856,
    recentSignups: 127,
    systemHealth: {
      database: 'healthy',
      api: 'healthy',
      payments: 'warning'
    }
  };

  const mockUserMetrics: UserMetrics = {
    consumers: 9847,
    merchants: 2156,
    agents: 844,
    dailyActiveUsers: 3421,
    monthlyActiveUsers: 8934
  };

  const mockTransactionMetrics: TransactionMetrics = {
    totalTransactions: 45632,
    successfulTransactions: 44891,
    failedTransactions: 741,
    averageTransactionValue: "62.35",
    topMerchants: [
      { id: "1", name: "AfriMart General Store", volume: "45,231.50", transactions: 1247 },
      { id: "2", name: "Lagos Food Hub", volume: "38,492.25", transactions: 986 },
      { id: "3", name: "Tech Solutions Ltd", volume: "29,847.75", transactions: 742 },
      { id: "4", name: "Fashion Boutique", volume: "24,593.60", transactions: 654 },
      { id: "5", name: "Mobile Repair Shop", volume: "19,384.30", transactions: 521 }
    ]
  };

  const mockFinancialMetrics: FinancialMetrics = {
    totalWalletBalance: "15847392.75",
    totalInvestments: "4729584.20",
    totalCreditIssued: "2847593.80",
    cryptoHoldings: "1923847.45",
    revenueToday: "23,847.60",
    revenueMonth: "542,931.45"
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-accent';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-neutral-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Shield className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-accent" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Activity className="w-4 h-4 text-neutral-600" />;
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value));
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const successRate = ((mockTransactionMetrics.successfulTransactions / mockTransactionMetrics.totalTransactions) * 100);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 truncate">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">AfriPay System Overview & Analytics</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="w-full sm:w-auto min-h-[44px]"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
          <span className="sm:hidden">Refresh Data</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="min-h-[120px]">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-neutral-600 truncate">Total Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{formatNumber(mockStats.totalUsers)}</p>
                <p className="text-xs text-success truncate">+{mockStats.recentSignups} today</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[120px]">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-neutral-600 truncate">Total Volume</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{formatCurrency(mockStats.totalVolume)}</p>
                <p className="text-xs text-success truncate">+12.5% vs last month</p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-success flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[120px]">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-neutral-600 truncate">Transactions</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{formatNumber(mockStats.totalTransactions)}</p>
                <p className="text-xs text-success truncate">{successRate.toFixed(1)}% success rate</p>
              </div>
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-accent flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[120px]">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between h-full">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-neutral-600 truncate">Active Wallets</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{formatNumber(mockStats.activeWallets)}</p>
                <p className="text-xs text-neutral-600 truncate">{mockStats.kycVerified} verified</p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-secondary flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">System Health</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-neutral-50 rounded-lg min-h-[60px]">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">Database</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {getHealthIcon(mockStats.systemHealth.database)}
                <span className={`text-xs sm:text-sm capitalize ${getHealthColor(mockStats.systemHealth.database)}`}>
                  {mockStats.systemHealth.database}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-neutral-50 rounded-lg min-h-[60px]">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">API</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {getHealthIcon(mockStats.systemHealth.api)}
                <span className={`text-xs sm:text-sm capitalize ${getHealthColor(mockStats.systemHealth.api)}`}>
                  {mockStats.systemHealth.api}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-neutral-50 rounded-lg min-h-[60px]">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">Payments</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {getHealthIcon(mockStats.systemHealth.payments)}
                <span className={`text-xs sm:text-sm capitalize ${getHealthColor(mockStats.systemHealth.payments)}`}>
                  {mockStats.systemHealth.payments}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-5 min-w-full sm:w-full h-auto sm:h-auto">
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px]">
              <Users className="w-4 h-4 sm:hidden mr-1" />
              <span className="hidden sm:inline">Users</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px]">
              <Activity className="w-4 h-4 sm:hidden mr-1" />
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">Txns</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px]">
              <DollarSign className="w-4 h-4 sm:hidden mr-1" />
              <span className="hidden sm:inline">Financial</span>
              <span className="sm:hidden">Finance</span>
            </TabsTrigger>
            <TabsTrigger value="kyc" className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px]">
              <Shield className="w-4 h-4 sm:hidden mr-1" />
              <span className="hidden sm:inline">KYC</span>
              <span className="sm:hidden">KYC</span>
            </TabsTrigger>
            <TabsTrigger value="developer" className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px]">
              <Settings className="w-4 h-4 sm:hidden mr-1" />
              <span className="hidden sm:inline">Developer</span>
              <span className="sm:hidden">Dev</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="space-y-3 sm:space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">User Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Consumers</span>
                    <span className="font-bold">{formatNumber(mockUserMetrics.consumers)}</span>
                  </div>
                  <Progress value={(mockUserMetrics.consumers / mockStats.totalUsers) * 100} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Merchants</span>
                    <span className="font-bold">{formatNumber(mockUserMetrics.merchants)}</span>
                  </div>
                  <Progress value={(mockUserMetrics.merchants / mockStats.totalUsers) * 100} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Agents</span>
                    <span className="font-bold">{formatNumber(mockUserMetrics.agents)}</span>
                  </div>
                  <Progress value={(mockUserMetrics.agents / mockStats.totalUsers) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">User Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <span>Daily Active Users</span>
                  <Badge className="bg-primary/10 text-primary">
                    {formatNumber(mockUserMetrics.dailyActiveUsers)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Monthly Active Users</span>
                  <Badge className="bg-success/10 text-success">
                    {formatNumber(mockUserMetrics.monthlyActiveUsers)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>DAU/MAU Ratio</span>
                  <Badge className="bg-accent/10 text-accent">
                    {((mockUserMetrics.dailyActiveUsers / mockUserMetrics.monthlyActiveUsers) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-3 sm:space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="text-center p-3 bg-success/5 rounded-lg">
                    <p className="text-lg sm:text-2xl font-bold text-success">{formatNumber(mockTransactionMetrics.successfulTransactions)}</p>
                    <p className="text-xs sm:text-sm text-neutral-600">Successful</p>
                  </div>
                  <div className="text-center p-3 bg-destructive/5 rounded-lg">
                    <p className="text-lg sm:text-2xl font-bold text-destructive">{formatNumber(mockTransactionMetrics.failedTransactions)}</p>
                    <p className="text-xs sm:text-sm text-neutral-600">Failed</p>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-lg sm:text-2xl font-bold text-primary">{formatCurrency(mockTransactionMetrics.averageTransactionValue)}</p>
                    <p className="text-xs sm:text-sm text-neutral-600">Average Value</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold mb-3">Top Merchants by Volume</p>
                  <div className="space-y-2">
                    {mockTransactionMetrics.topMerchants.map((merchant, index) => (
                      <div key={merchant.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="font-medium">{merchant.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${merchant.volume}</p>
                          <p className="text-xs text-neutral-600">{merchant.transactions} transactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-3 sm:space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Wallet Balance</span>
                  <span className="font-bold">{formatCurrency(mockFinancialMetrics.totalWalletBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Investments</span>
                  <span className="font-bold">{formatCurrency(mockFinancialMetrics.totalInvestments)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Credit Issued</span>
                  <span className="font-bold">{formatCurrency(mockFinancialMetrics.totalCreditIssued)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Crypto Holdings</span>
                  <span className="font-bold">{formatCurrency(mockFinancialMetrics.cryptoHoldings)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600">Today</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(mockFinancialMetrics.revenueToday)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">This Month</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(mockFinancialMetrics.revenueMonth)}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-neutral-600">Revenue Sources: Transaction fees, Investment commissions, Credit interest</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-3 sm:space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">KYC Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-3 bg-success/5 rounded-lg">
                    <p className="text-lg sm:text-xl font-bold text-success">{formatNumber(mockStats.kycVerified)}</p>
                    <p className="text-xs sm:text-sm text-neutral-600">Verified Users</p>
                    <Progress value={(mockStats.kycVerified / mockStats.totalUsers) * 100} className="mt-2" />
                  </div>
                  <div className="p-3 bg-accent/5 rounded-lg">
                    <p className="text-lg sm:text-xl font-bold text-accent">{formatNumber(mockStats.kycPending)}</p>
                    <p className="text-xs sm:text-sm text-neutral-600">Pending Review</p>
                    <Progress value={(mockStats.kycPending / mockStats.totalUsers) * 100} className="mt-2" />
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-accent">Action Required</p>
                  <p className="text-xs text-neutral-600">{mockStats.kycPending} users waiting for KYC verification</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <DemoDataManager />
        </TabsContent>

        <TabsContent value="developer" className="space-y-3 sm:space-y-6 mt-4">
          <div className="grid gap-3 sm:gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  Component Library
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-neutral-600">
                  Access the AfriPay component library with interactive documentation and examples.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    onClick={() => window.open('/component-library', '_blank')}
                    className="w-full min-h-[44px] text-sm"
                  >
                    Open Component Library
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('/storybook', '_blank')}
                    className="w-full min-h-[44px] text-sm"
                  >
                    Open Storybook
                  </Button>
                </div>
                <div className="p-2 sm:p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xs text-neutral-600 font-mono">
                    bun codex.component.mts list
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  CLI Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Command-line tools for component management and development workflow.
                </p>
                <div className="space-y-2 text-xs font-mono bg-neutral-900 text-neutral-100 p-3 rounded-lg">
                  <div># Add new component</div>
                  <div>bun codex.component.mts add Forms/Input input</div>
                  <div className="mt-2"># Remove component</div>
                  <div>bun codex.component.mts remove Forms/Input</div>
                  <div className="mt-2"># List all components</div>
                  <div>bun codex.component.mts list</div>
                </div>
                <div className="text-xs text-neutral-600">
                  Templates: box, button, input, modal
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Component Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">60+</p>
                    <p className="text-sm text-neutral-600">Total Components</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">20+</p>
                    <p className="text-sm text-neutral-600">Categories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">AAA</p>
                    <p className="text-sm text-neutral-600">Accessibility</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-info">100%</p>
                    <p className="text-sm text-neutral-600">TypeScript</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Quality Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">WCAG AAA Compliance</span>
                  <Badge variant="secondary">✓ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">TypeScript Coverage</span>
                  <Badge variant="secondary">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Test Coverage</span>
                  <Badge variant="secondary">80%+</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storybook Stories</span>
                  <Badge variant="secondary">✓ Generated</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}