import { useQuery } from "@tanstack/react-query";
import { Store, FaTrendingUp, Users, FaDollarSign, QrCode } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

export default function MerchantDashboard() {
  const { toast } = useToast();
  
  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Calculate merchant metrics
  const todaysRevenue = transactions
    .filter(tx => {
      const today = new Date().toDateString();
      return new Date(tx.createdAt).toDateString() === today && tx.type === 'receive';
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const totalCustomers = new Set(
    transactions
      .filter(tx => tx.type === 'receive')
      .map(tx => tx.fromWalletId)
  ).size;

  const handleGenerateQR = () => {
    toast({
      title: "QR Code Generator",
      description: "Merchant QR code generation coming soon",
    });
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Analytics Dashboard",
      description: "Detailed merchant analytics coming soon",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Merchant Dashboard</h2>
            <p className="text-neutral-600">Manage your business payments</p>
          </div>
        </div>
        <Badge className="bg-success/10 text-success">
          Verified Merchant
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-900">
                ${todaysRevenue.toFixed(2)}
              </span>
              <FaTrendingUp className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-900">
                ${parseFloat(wallet?.balance || "0").toFixed(2)}
              </span>
              <FaDollarSign className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3">
        <Button 
          className="flex items-center justify-between p-4 h-auto bg-white border border-gray-200 text-left hover:bg-gray-50"
          variant="ghost"
          onClick={handleGenerateQR}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">Generate Payment QR</h3>
              <p className="text-sm text-neutral-600">Create QR code for customer payments</p>
            </div>
          </div>
        </Button>

        <Button 
          className="flex items-center justify-between p-4 h-auto bg-white border border-gray-200 text-left hover:bg-gray-50"
          variant="ghost"
          onClick={handleViewAnalytics}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <FaTrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">Business Analytics</h3>
              <p className="text-sm text-neutral-600">View sales trends and insights</p>
            </div>
          </div>
        </Button>

        <Button 
          className="flex items-center justify-between p-4 h-auto bg-white border border-gray-200 text-left hover:bg-gray-50"
          variant="ghost"
          onClick={() => toast({ title: "Coming Soon", description: "Customer management features coming soon" })}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">Customer Management</h3>
              <p className="text-sm text-neutral-600">Track customers and loyalty</p>
            </div>
          </div>
        </Button>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.filter(tx => tx.type === 'receive').slice(0, 3).length === 0 ? (
            <p className="text-center text-neutral-600 py-4">No payments received yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.filter(tx => tx.type === 'receive').slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">
                      {transaction.description || 'Customer Payment'}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-bold text-success">
                    +${parseFloat(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}