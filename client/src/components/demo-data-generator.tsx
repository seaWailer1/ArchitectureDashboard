import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Sparkles, 
  User, 
  Building2, 
  Users,
  CreditCard,
  TrendingUp,
  Package,
  Car,
  ShoppingBag,
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Play,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: string;
  features: string[];
  role: 'consumer' | 'merchant' | 'agent' | 'all';
}

export default function DemoDataGenerator() {
  const [selectedScenario, setSelectedScenario] = useState<string>("comprehensive");
  const [selectedRole, setSelectedRole] = useState<string>("consumer");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const demoScenarios: DemoScenario[] = [
    {
      id: "comprehensive",
      title: "Complete Financial Profile",
      description: "Full ecosystem with all services, transactions, and realistic financial data",
      icon: Sparkles,
      duration: "30 seconds",
      features: [
        "Multi-wallet setup with realistic balances",
        "Transaction history across all services",
        "Investment portfolio with returns",
        "Crypto holdings and trading history",
        "Bill payment history",
        "Shopping orders and favorites",
        "Ride booking history",
        "Virtual cards and loans"
      ],
      role: 'all'
    },
    {
      id: "consumer_basic",
      title: "New Consumer Journey",
      description: "Fresh user experience with introductory transactions and services",
      icon: User,
      duration: "15 seconds",
      features: [
        "Basic wallet with starter balance",
        "First-time user transactions",
        "Sample bill payments",
        "Shopping cart with products",
        "Investment recommendations"
      ],
      role: 'consumer'
    },
    {
      id: "merchant_active",
      title: "Active Merchant Business",
      description: "Established business with sales history, inventory, and customer base",
      icon: Building2,
      duration: "25 seconds",
      features: [
        "Business wallet with revenue",
        "Sales transaction history",
        "Customer payment patterns",
        "Inventory management data",
        "Business analytics metrics"
      ],
      role: 'merchant'
    },
    {
      id: "agent_network",
      title: "Agent Network Operations",
      description: "Cash-in/out operations with commission tracking and agent metrics",
      icon: Users,
      duration: "20 seconds",
      features: [
        "Agent commission wallet",
        "Cash-in/out transaction history",
        "Customer service records",
        "Performance metrics",
        "Network activity data"
      ],
      role: 'agent'
    },
    {
      id: "financial_power",
      title: "Financial Power User",
      description: "Advanced financial activities with investments, trading, and premium services",
      icon: TrendingUp,
      duration: "35 seconds",
      features: [
        "Premium account features",
        "Advanced investment portfolio",
        "Multi-currency trading history",
        "Crypto trading activities",
        "Credit facilities utilization",
        "VIP service access"
      ],
      role: 'all'
    }
  ];

  const generateDemoDataMutation = useMutation({
    mutationFn: async (config: any) => {
      await apiRequest("POST", "/api/seed-demo-data", config);
    },
    onSuccess: () => {
      setGenerationProgress(100);
      setLastGenerated(new Date().toLocaleString());
      toast({
        title: "Demo Data Generated",
        description: "Your demo environment is ready to explore!",
      });
      
      // Auto-refresh data if enabled
      if (autoRefresh) {
        setTimeout(() => {
          queryClient.invalidateQueries();
        }, 1000);
      }
      
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 2000);
    },
    onError: () => {
      setIsGenerating(false);
      setGenerationProgress(0);
      toast({
        title: "Generation Failed",
        description: "Failed to generate demo data",
        variant: "destructive",
      });
    },
  });

  const handleGenerateData = async () => {
    const scenario = demoScenarios.find(s => s.id === selectedScenario);
    if (!scenario) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress for better UX
    const progressSteps = [
      { progress: 15, message: "Setting up user profile..." },
      { progress: 30, message: "Creating wallet structure..." },
      { progress: 45, message: "Generating transaction history..." },
      { progress: 60, message: "Setting up investments..." },
      { progress: 75, message: "Adding service history..." },
      { progress: 90, message: "Finalizing demo environment..." },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step.progress);
      toast({
        title: "Generating Demo Data",
        description: step.message,
      });
    }

    generateDemoDataMutation.mutate({
      scenario: selectedScenario,
      role: selectedRole,
      features: scenario.features
    });
  };

  const selectedScenarioData = demoScenarios.find(s => s.id === selectedScenario);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Demo Data Generator</h2>
        <p className="text-neutral-600">Experience AfriPay with realistic sample data</p>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Demo Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Demo Scenario</label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {demoScenarios.map(scenario => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    <div className="flex items-center space-x-2">
                      <scenario.icon className="w-4 h-4" />
                      <span>{scenario.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Primary Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumer">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Consumer</span>
                  </div>
                </SelectItem>
                <SelectItem value="merchant">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>Merchant</span>
                  </div>
                </SelectItem>
                <SelectItem value="agent">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Agent</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-refresh Data</p>
              <p className="text-xs text-neutral-600">Automatically update all views after generation</p>
            </div>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>
        </CardContent>
      </Card>

      {/* Scenario Preview */}
      {selectedScenarioData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <selectedScenarioData.icon className="w-5 h-5" />
              <span>{selectedScenarioData.title}</span>
              <Badge variant="outline" className="ml-auto">
                {selectedScenarioData.duration}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600 mb-4">{selectedScenarioData.description}</p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Included Features:</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedScenarioData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
              <div>
                <p className="font-medium">Generating Demo Data...</p>
                <p className="text-sm text-neutral-600">Please wait while we set up your demo environment</p>
              </div>
              <div className="space-y-2">
                <Progress value={generationProgress} className="w-full" />
                <p className="text-xs text-neutral-500">{generationProgress}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Button
              onClick={handleGenerateData}
              disabled={isGenerating}
              size="lg"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Generate Demo Data
                </>
              )}
            </Button>
            
            {lastGenerated && (
              <p className="text-xs text-neutral-500">
                Last generated: {lastGenerated}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Icons Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Services Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: CreditCard, name: "Wallet", color: "text-blue-500" },
              { icon: TrendingUp, name: "Investments", color: "text-green-500" },
              { icon: Package, name: "Delivery", color: "text-purple-500" },
              { icon: Car, name: "Rides", color: "text-orange-500" },
              { icon: ShoppingBag, name: "Shopping", color: "text-pink-500" },
              { icon: Zap, name: "Bills", color: "text-yellow-500" },
              { icon: Building2, name: "Business", color: "text-indigo-500" },
              { icon: Users, name: "Network", color: "text-cyan-500" }
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <p className="text-xs text-neutral-600">{service.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips & Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Demo Data Tips</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Demo data is reset with each generation</li>
                <li>• All financial amounts are simulated for demonstration</li>
                <li>• Role switching will maintain relevant demo context</li>
                <li>• Generated data includes realistic African market scenarios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}