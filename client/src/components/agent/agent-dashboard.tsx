import { useQuery } from "@tanstack/react-query";
import { Handshake, TrendingUp, Users, Banknote, MapPin, Clock } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

export default function AgentDashboard() {
  const { toast } = useToast();
  
  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Calculate agent metrics
  const todaysCommission = transactions
    .filter(tx => {
      const today = new Date().toDateString();
      return new Date(tx.createdAt).toDateString() === today;
    })
    .reduce((sum, tx) => sum + (parseFloat(tx.fees || "0")), 0);

  const customersServed = transactions.length;
  const floatBalance = 5000; // Mock float balance
  const dailyLimit = 10000;
  const floatUsage = ((dailyLimit - floatBalance) / dailyLimit) * 100;

  const agentServices = [
    {
      icon: Banknote,
      title: "Cash In/Out",
      description: "Help customers deposit and withdraw cash",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: Users,
      title: "Customer Onboarding",
      description: "Register new users and verify accounts",
      color: "bg-success/10 text-success"
    },
    {
      icon: MapPin,
      title: "Territory Management",
      description: "Manage your assigned service area",
      color: "bg-accent/10 text-accent"
    },
    {
      icon: TrendingUp,
      title: "Commission Tracking",
      description: "Track earnings and performance",
      color: "bg-secondary/10 text-secondary"
    }
  ];

  const handleServiceAction = (service: string) => {
    toast({
      title: `${service} Service`,
      description: `${service} functionality coming soon`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Handshake className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Agent Dashboard</h2>
            <p className="text-neutral-600">Serve your community</p>
          </div>
        </div>
        <div className="text-right">
          <Badge className="bg-accent/10 text-accent mb-1">
            Agent ID: AG001
          </Badge>
          <p className="text-sm text-neutral-600">Active Status</p>
        </div>
      </div>

      {/* Float Management */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Float Balance</span>
            <Badge variant="outline">${floatBalance.toLocaleString()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Daily Limit Usage</span>
              <span>{floatUsage.toFixed(1)}%</span>
            </div>
            <Progress value={floatUsage} className="h-2" />
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Available: ${floatBalance.toLocaleString()}</span>
              <span>Limit: ${dailyLimit.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Today's Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-900">
                ${todaysCommission.toFixed(2)}
              </span>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Customers Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-neutral-900">
                {customersServed}
              </span>
              <Users className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Services */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Agent Services</h3>
        <div className="grid grid-cols-1 gap-3">
          {agentServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Button
                key={index}
                className="flex items-center justify-between p-4 h-auto bg-white border border-gray-200 text-left hover:bg-gray-50"
                variant="ghost"
                onClick={() => handleServiceAction(service.title)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{service.title}</h4>
                    <p className="text-sm text-neutral-600">{service.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.slice(0, 3).length === 0 ? (
            <p className="text-center text-neutral-600 py-4">No recent activities</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">
                      {transaction.type === 'topup' ? 'Cash In Service' : 
                       transaction.type === 'withdraw' ? 'Cash Out Service' : 
                       'Transaction Service'}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-neutral-900">
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </span>
                    <p className="text-xs text-success">
                      +${(parseFloat(transaction.amount) * 0.025).toFixed(2)} commission
                    </p>
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