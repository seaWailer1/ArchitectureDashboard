import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Wallet, 
  TrendingUp, 
  Send, 
  QrCode, 
  ShoppingBag, 
  Car,
  Phone,
  Zap,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import SendMoney from "@/components/services/send-money";
import PayScan from "@/components/services/pay-scan";
import BuyAirtime from "@/components/services/buy-airtime";
import PayBills from "@/components/services/pay-bills";
import Shop from "@/components/services/shop";
import Transport from "@/components/services/transport";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  status: string;
  createdAt: string;
}

interface WalletData {
  id: number;
  balance: string;
  currency: string;
  walletType: string;
}

export default function ConsumerDashboard() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: wallets = [] } = useQuery<WalletData[]>({
    queryKey: ["/api/wallets"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: holdings = [] } = useQuery({
    queryKey: ["/api/wallets/holdings"],
  });

  const primaryWallet = wallets.find(w => w.walletType === 'primary') || wallets[0];
  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance || "0"), 0);
  
  const recentTransactions = transactions.slice(0, 3);

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const quickServices = [
    { icon: Send, label: "Send Money", color: "bg-blue-100 text-blue-600", action: () => setSelectedService('send-money') },
    { icon: QrCode, label: "Pay & Scan", color: "bg-green-100 text-green-600", action: () => setSelectedService('pay-scan') },
    { icon: Phone, label: "Buy Airtime", color: "bg-purple-100 text-purple-600", action: () => setSelectedService('buy-airtime') },
    { icon: Zap, label: "Pay Bills", color: "bg-orange-100 text-orange-600", action: () => setSelectedService('pay-bills') },
    { icon: ShoppingBag, label: "Shop", color: "bg-pink-100 text-pink-600", action: () => setSelectedService('shop') },
    { icon: Car, label: "Transport", color: "bg-indigo-100 text-indigo-600", action: () => setSelectedService('transport') },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return '↗️';
      case 'receive': return '↙️';
      case 'topup': return '⬆️';
      case 'payment': return '💳';
      default: return '💰';
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">Total Balance</p>
              <h2 className="text-3xl font-bold">{formatCurrency(totalBalance)}</h2>
              <p className="text-white/60 text-sm mt-1">Available in {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Primary Wallet</p>
              <p className="text-xl font-semibold">{formatCurrency(primaryWallet?.balance || 0)}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Services */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {quickServices.map((service) => {
              const Icon = service.icon;
              return (
                <Button
                  key={service.label}
                  variant="ghost"
                  className="h-auto p-4 flex flex-col space-y-2"
                  onClick={service.action}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center font-medium">{service.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-6">
              <Wallet className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 mb-3">No recent transactions</p>
              <Button size="sm">
                Start your first transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-neutral-600 capitalize">{transaction.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                    <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Investment Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">High-Yield Savings</h4>
                <Badge className="bg-green-100 text-green-700">4.5% APY</Badge>
              </div>
              <p className="text-sm text-green-700 mb-3">Grow your money with our premium savings account</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Learn More
              </Button>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-purple-800">Crypto Portfolio</h4>
                <Badge className="bg-purple-100 text-purple-700">Starter</Badge>
              </div>
              <p className="text-sm text-purple-700 mb-3">Start investing in cryptocurrencies with as little as $10</p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Services Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedService === 'send-money' ? 'Send Money' :
               selectedService === 'pay-scan' ? 'Pay & Scan' :
               selectedService === 'buy-airtime' ? 'Buy Airtime' :
               selectedService === 'pay-bills' ? 'Pay Bills' :
               selectedService === 'shop' ? 'Shop' :
               selectedService === 'transport' ? 'Transport' : 'Service'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedService === 'send-money' && (
            <SendMoney onBack={() => setSelectedService(null)} />
          )}
          {selectedService === 'pay-scan' && (
            <PayScan onBack={() => setSelectedService(null)} />
          )}
          {selectedService === 'buy-airtime' && (
            <BuyAirtime onBack={() => setSelectedService(null)} />
          )}
          {selectedService === 'pay-bills' && (
            <PayBills onBack={() => setSelectedService(null)} />
          )}
          {selectedService === 'shop' && (
            <Shop onBack={() => setSelectedService(null)} />
          )}
          {selectedService === 'transport' && (
            <Transport onBack={() => setSelectedService(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}