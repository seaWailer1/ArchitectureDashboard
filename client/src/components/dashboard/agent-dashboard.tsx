import { useQuery } from "@tanstack/react-query";
import { 
  FaBuilding, 
  FaChartLine, 
  Users, 
  FaDollarSign, 
  Target,
  Award,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  Mail,
  Calendar,
  FaPlus,
  FaExternalLinkAlt,
  FaCheckCircle
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface AgentMetrics {
  totalCommission: number;
  monthlyCommission: number;
  customersServed: number;
  conversionRate: number;
  rank: string;
  targetProgress: number;
  recentCustomers: Array<{
    name: string;
    service: string;
    commission: number;
    date: string;
  }>;
}

export default function AgentDashboard() {
  const { toast } = useToast();

  const { data: wallets = [] } = useQuery({
    queryKey: ["/api/wallets"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Mock agent metrics (would come from API in real implementation)
  const agentMetrics: AgentMetrics = {
    totalCommission: 12450.75,
    monthlyCommission: 2340.50,
    customersServed: 89,
    conversionRate: 78.5,
    rank: "Gold Agent",
    targetProgress: 67,
    recentCustomers: [
      { name: "John Doe", service: "Account Opening", commission: 25.00, date: "2024-01-15" },
      { name: "Jane Smith", service: "Loan Application", commission: 150.00, date: "2024-01-14" },
      { name: "Mike Johnson", service: "Insurance", commission: 75.00, date: "2024-01-13" },
    ]
  };

  const agentWallet = wallets.find(w => w.walletType === 'business') || wallets[0];
  
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const agentServices = [
    { 
      icon: Users, 
      label: "New Customer", 
      color: "bg-blue-100 text-blue-600", 
      description: "Register new customer",
      action: () => toast({ title: "Customer Registration", description: "Customer registration feature coming soon!" }) 
    },
    { 
      icon: FaDollarSign, 
      label: "Cash Services", 
      color: "bg-green-100 text-green-600", 
      description: "Cash in/out services",
      action: () => toast({ title: "Cash Services", description: "Cash services feature coming soon!" }) 
    },
    { 
      icon: FaPhone, 
      label: "Mobile Money", 
      color: "bg-purple-100 text-purple-600", 
      description: "Mobile money transfers",
      action: () => toast({ title: "Mobile Money", description: "Mobile money feature coming soon!" }) 
    },
    { 
      icon: FaCheckCircle, 
      label: "KYC Verification", 
      color: "bg-orange-100 text-orange-600", 
      description: "Verify customer identity",
      action: () => toast({ title: "KYC", description: "KYC verification feature coming soon!" }) 
    },
  ];

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Gold Agent': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Silver Agent': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Bronze Agent': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Overview */}
      <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm">Commission Earned</p>
              <h2 className="text-3xl font-bold">{formatCurrency(agentMetrics.totalCommission)}</h2>
              <div className="flex items-center space-x-2 mt-2">
                <Award className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-300 text-sm">{agentMetrics.rank}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">This Month</p>
              <p className="text-xl font-semibold">{formatCurrency(agentMetrics.monthlyCommission)}</p>
              <p className="text-white/60 text-sm">{agentMetrics.customersServed} customers served</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white flex-1">
              <Target className="w-4 h-4 mr-2" />
              View Targets
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white flex-1">
              <FaChartLine className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{agentMetrics.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaChartLine className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Customers</p>
                <p className="text-2xl font-bold">{agentMetrics.customersServed}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Target Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Monthly Target Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Target Achievement</span>
              <span className="font-semibold">{agentMetrics.targetProgress}% Complete</span>
            </div>
            <Progress value={agentMetrics.targetProgress} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Current: {formatCurrency(agentMetrics.monthlyCommission)}</span>
              <span className="text-neutral-600">Target: {formatCurrency(3500)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Services */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {agentServices.map((service) => {
              const Icon = service.icon;
              return (
                <Button
                  key={service.label}
                  variant="ghost"
                  className="h-auto p-4 flex flex-col space-y-2 text-left"
                  onClick={service.action}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${service.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{service.label}</p>
                    <p className="text-xs text-neutral-600">{service.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Agent Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Agent Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getRankColor(agentMetrics.rank)}`}>
                  <Award className="w-4 h-4 mr-2" />
                  {agentMetrics.rank}
                </div>
                <p className="text-sm text-neutral-600 mt-2">Current Status</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="font-semibold text-lg">{agentMetrics.customersServed}</p>
                <p className="text-neutral-600">Customers Served</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="font-semibold text-lg">{agentMetrics.conversionRate}%</p>
                <p className="text-neutral-600">Success Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Customer Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Customer Activities</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <FaExternalLinkAlt className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agentMetrics.recentCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-neutral-600">{customer.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+{formatCurrency(customer.commission)}</p>
                  <p className="text-xs text-neutral-600">{new Date(customer.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location & Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="w-5 h-5 text-neutral-600" />
              <span className="text-sm">Lagos, Victoria Island</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaClock className="w-5 h-5 text-neutral-600" />
              <span className="text-sm">Operating Hours: 8AM - 6PM</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="w-5 h-5 text-neutral-600" />
              <span className="text-sm">+234 xxx xxxx</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}