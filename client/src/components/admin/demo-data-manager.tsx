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
  Settings,
  Database,
  Trash2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function DemoDataManager() {
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
        "Credit facility usage"
      ],
      role: 'merchant'
    },
    {
      id: "agent_network",
      title: "Agent Network Operations",
      description: "Active agent with commission tracking, float management, and service network",
      icon: Users,
      duration: "20 seconds",
      features: [
        "Agent wallet with commissions",
        "Float management transactions",
        "Customer service history",
        "Network performance metrics",
        "Regional activity data"
      ],
      role: 'agent'
    }
  ];

  const roleOptions = [
    {
      role: "consumer",
      title: "Consumer Profile",
      description: "Personal wallet with savings, basic crypto holdings, and simple transactions",
      icon: User,
      color: "bg-blue-100 text-blue-700"
    },
    {
      role: "merchant",
      title: "Merchant Profile", 
      description: "Business wallet with payment processing, investments, and credit facilities",
      icon: Building2,
      color: "bg-green-100 text-green-700"
    },
    {
      role: "agent",
      title: "Agent Profile",
      description: "Agent wallet with commission tracking, float management, and multiple investments",
      icon: Users,
      color: "bg-purple-100 text-purple-700"
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
        description: "Demo environment is ready for testing",
      });
      
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
    onError: (error: any) => {
      setIsGenerating(false);
      setGenerationProgress(0);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate demo data",
        variant: "destructive",
      });
    },
  });

  const seedDataMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest("POST", "/api/seed-demo-data", { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Demo Data Created",
        description: "Sample financial data has been added",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Demo Data",
        description: error.message || "There was an error creating sample data",
        variant: "destructive",
      });
    },
  });

  const clearDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/clear-demo-data");
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setLastGenerated(null);
      toast({
        title: "Demo Data Cleared",
        description: "All demo data has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Clear Data",
        description: "There was an error clearing demo data",
        variant: "destructive",
      });
    },
  });

  const handleGenerateData = async () => {
    const scenario = demoScenarios.find(s => s.id === selectedScenario);
    if (!scenario) return;

    setIsGenerating(true);
    setGenerationProgress(0);

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
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Demo Data Management</h2>
        <p className="text-neutral-600">Generate and manage realistic sample data for testing</p>
      </div>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Advanced Scenarios</TabsTrigger>
          <TabsTrigger value="quick">Quick Generation</TabsTrigger>
          <TabsTrigger value="management">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Scenario Selection */}
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
                <label className="text-sm font-medium mb-2 block">Target Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumer">Consumer</SelectItem>
                    <SelectItem value="merchant">Merchant</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="all">All Roles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-refresh after generation</span>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </CardContent>
          </Card>

          {/* Scenario Details */}
          {selectedScenarioData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <selectedScenarioData.icon className="w-5 h-5" />
                  <span>{selectedScenarioData.title}</span>
                  <Badge variant="outline">{selectedScenarioData.duration}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-4">{selectedScenarioData.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Features included:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedScenarioData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation Controls */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleGenerateData}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating... ({generationProgress}%)
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Generate Demo Data
                  </>
                )}
              </Button>
              
              {isGenerating && (
                <div className="mt-4">
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}
              
              {lastGenerated && (
                <p className="text-sm text-neutral-500 mt-2 text-center">
                  Last generated: {lastGenerated}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Quick Demo Generation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-neutral-600">
                Generate basic demo data quickly for different user roles.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.role}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start"
                      disabled={seedDataMutation.isPending}
                      onClick={() => seedDataMutation.mutate(option.role)}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{option.title}</p>
                          <p className="text-sm text-neutral-600">{option.description}</p>
                        </div>
                        {seedDataMutation.isPending && (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                <p className="font-medium mb-1">What gets created:</p>
                <ul className="space-y-1">
                  <li>• Multiple wallet types (Primary, Savings, Crypto, Investment)</li>
                  <li>• Sample cryptocurrency holdings (BTC, ETH, USDC)</li>
                  <li>• Investment products with realistic returns</li>
                  <li>• Credit facilities (for merchants and agents)</li>
                  <li>• Transaction history relevant to each role</li>
                  <li>• Role-specific business data</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Warning</p>
                    <p className="text-sm text-yellow-700">
                      Clearing demo data will remove all generated sample data including transactions, 
                      wallets, and holdings. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                variant="destructive"
                onClick={() => clearDataMutation.mutate()}
                disabled={clearDataMutation.isPending}
                className="w-full"
              >
                {clearDataMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Clearing Data...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Demo Data
                  </>
                )}
              </Button>

              <div className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Data Cleanup Details:</p>
                    <ul className="space-y-1">
                      <li>• Removes all demo transactions and wallet balances</li>
                      <li>• Clears cryptocurrency holdings and investments</li>
                      <li>• Removes credit facilities and loan data</li>
                      <li>• Preserves user account and authentication data</li>
                      <li>• Maintains system configuration and settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}