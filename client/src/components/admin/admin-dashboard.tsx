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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-600">AfriPay System Overview & Analytics</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(mockStats.totalUsers)}</p>
                <p className="text-xs text-success">+{mockStats.recentSignups} today</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(mockStats.totalVolume)}</p>
                <p className="text-xs text-success">+12.5% vs last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Transactions</p>
                <p className="text-2xl font-bold">{formatNumber(mockStats.totalTransactions)}</p>
                <p className="text-xs text-success">{successRate.toFixed(1)}% success rate</p>
              </div>
              <Activity className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Wallets</p>
                <p className="text-2xl font-bold">{formatNumber(mockStats.activeWallets)}</p>
                <p className="text-xs text-neutral-600">{mockStats.kycVerified} verified</p>
              </div>
              <BarChart3 className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span className="font-medium">Database</span>
              </div>
              <div className="flex items-center space-x-2">
                {getHealthIcon(mockStats.systemHealth.database)}
                <span className={`text-sm capitalize ${getHealthColor(mockStats.systemHealth.database)}`}>
                  {mockStats.systemHealth.database}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span className="font-medium">API</span>
              </div>
              <div className="flex items-center space-x-2">
                {getHealthIcon(mockStats.systemHealth.api)}
                <span className={`text-sm capitalize ${getHealthColor(mockStats.systemHealth.api)}`}>
                  {mockStats.systemHealth.api}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                {getHealthIcon(mockStats.systemHealth.payments)}
                <span className={`text-sm capitalize ${getHealthColor(mockStats.systemHealth.payments)}`}>
                  {mockStats.systemHealth.payments}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{formatNumber(mockTransactionMetrics.successfulTransactions)}</p>
                    <p className="text-sm text-neutral-600">Successful</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{formatNumber(mockTransactionMetrics.failedTransactions)}</p>
                    <p className="text-sm text-neutral-600">Failed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(mockTransactionMetrics.averageTransactionValue)}</p>
                    <p className="text-sm text-neutral-600">Average Value</p>
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

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

        <TabsContent value="kyc" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>KYC Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-bold text-success">{formatNumber(mockStats.kycVerified)}</p>
                    <p className="text-sm text-neutral-600">Verified Users</p>
                    <Progress value={(mockStats.kycVerified / mockStats.totalUsers) * 100} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-accent">{formatNumber(mockStats.kycPending)}</p>
                    <p className="text-sm text-neutral-600">Pending Review</p>
                    <Progress value={(mockStats.kycPending / mockStats.totalUsers) * 100} className="mt-2" />
                  </div>
                </div>
                <div className="mt-6 p-3 bg-accent/10 rounded-lg">
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
      </Tabs>
    </div>
  );
}