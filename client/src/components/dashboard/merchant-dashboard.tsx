import { useQuery } from "@tanstack/react-query";
import { 
  Store, 
  TrendingUp, 
  TrendingDown,
  Users, 
  CreditCard, 
  Package, 
  BarChart3,
  QrCode,
  Settings,
  Eye,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface BusinessMetrics {
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  monthlyGrowth: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export default function MerchantDashboard() {
  const { toast } = useToast();

  const { data: wallets = [] } = useQuery({
    queryKey: ["/api/wallets"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Mock business metrics (would come from API in real implementation)
  const businessMetrics: BusinessMetrics = {
    totalSales: 45780.50,
    totalTransactions: 324,
    averageTransaction: 141.30,
    monthlyGrowth: 12.5,
    topProducts: [
      { name: "Electronics", sales: 45, revenue: 18500 },
      { name: "Clothing", sales: 89, revenue: 12300 },
      { name: "Food & Drinks", sales: 156, revenue: 8900 },
    ]
  };

  const businessWallet = wallets.find(w => w.walletType === 'business') || wallets[0];
  const todaysTransactions = transactions.filter(t => {
    const today = new Date();
    const transactionDate = new Date(t.createdAt);
    return transactionDate.toDateString() === today.toDateString();
  });

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const quickActions = [
    { icon: QrCode, label: "Payment QR", color: "bg-blue-100 text-blue-600", action: () => toast({ title: "QR Code", description: "Generate payment QR code" }) },
    { icon: Package, label: "Inventory", color: "bg-green-100 text-green-600", action: () => toast({ title: "Inventory", description: "Manage your products" }) },
    { icon: Users, label: "Customers", color: "bg-purple-100 text-purple-600", action: () => toast({ title: "Customers", description: "View customer insights" }) },
    { icon: BarChart3, label: "Analytics", color: "bg-orange-100 text-orange-600", action: () => toast({ title: "Analytics", description: "View detailed analytics" }) },
  ];

  return (
    <div className="mobile-spacing-responsive">
      {/* Business Overview */}
      <Card className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white">
        <CardContent className="mobile-padding-responsive">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0 mb-4">
            <div className="flex-1">
              <p className="text-white/80 text-sm">Business Balance</p>
              <h2 className="text-2xl sm:text-3xl font-bold break-words">{formatCurrency(businessWallet?.balance || 0)}</h2>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-200" />
                <span className="text-green-200 text-sm">+{businessMetrics.monthlyGrowth}% this month</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-white/80 text-sm">Today's Sales</p>
              <p className="text-lg sm:text-xl font-semibold break-words">{formatCurrency(todaysTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0))}</p>
              <p className="text-white/60 text-sm">{todaysTransactions.length} transactions</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white flex-1 min-h-[44px] touch-aaa">
              <Eye className="w-4 h-4 mr-2" />
              View Sales
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white flex-1 min-h-[44px] touch-aaa">
              <QrCode className="w-4 h-4 mr-2" />
              Payment QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="mobile-grid-2">
        <Card>
          <CardContent className="mobile-padding-responsive">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-lg sm:text-2xl font-bold truncate">{formatCurrency(businessMetrics.totalSales)}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="mobile-padding-responsive">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg sm:text-2xl font-bold">{businessMetrics.totalTransactions}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="mobile-subheading-responsive">Business Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="h-auto p-4 flex flex-col space-y-2"
                  onClick={action.action}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sales Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Performance</CardTitle>
            <Button variant="ghost" size="sm">
              View Details
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Average Transaction</span>
              <span className="font-semibold">{formatCurrency(businessMetrics.averageTransaction)}</span>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Monthly Target</span>
                <span>75% Complete</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {businessMetrics.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-neutral-600">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-neutral-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span className="font-medium">QR Code Payments</span>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Card Payments</span>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}