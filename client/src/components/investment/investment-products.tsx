import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  Target,
  PiggyBank
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface InvestmentProduct {
  id: number;
  name: string;
  description: string;
  type: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: string;
  minimumAmount: string;
  maximumAmount: string;
  tenure: number;
  currency: string;
}

export default function InvestmentProducts() {
  const [selectedProduct, setSelectedProduct] = useState<InvestmentProduct | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<InvestmentProduct[]>({
    queryKey: ["/api/investment-products"],
  });

  const { data: userInvestments = [] } = useQuery({
    queryKey: ["/api/investments"],
  });

  const investMutation = useMutation({
    mutationFn: async (investmentData: any) => {
      await apiRequest("POST", "/api/investments", investmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      setShowInvestDialog(false);
      setInvestmentAmount("");
      toast({
        title: "Investment Created",
        description: "Your investment has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Investment Failed",
        description: "Failed to create investment",
        variant: "destructive",
      });
    },
  });

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Shield className="w-4 h-4 text-success" />;
      case 'medium':
        return <Target className="w-4 h-4 text-accent" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Shield className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-success/10 text-success';
      case 'medium':
        return 'bg-accent/10 text-accent';
      case 'high':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'savings':
        return <PiggyBank className="w-5 h-5" />;
      case 'fixed_deposit':
        return <Calendar className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const handleInvest = () => {
    if (!selectedProduct || !investmentAmount) {
      toast({
        title: "Invalid Investment",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(investmentAmount);
    const minAmount = parseFloat(selectedProduct.minimumAmount);
    const maxAmount = parseFloat(selectedProduct.maximumAmount || "999999");

    if (amount < minAmount || amount > maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between $${minAmount} and $${maxAmount}`,
        variant: "destructive",
      });
      return;
    }

    investMutation.mutate({
      productId: selectedProduct.id,
      principalAmount: amount,
    });
  };

  const calculateReturns = (product: InvestmentProduct, amount: string) => {
    if (!amount) return null;
    
    const principal = parseFloat(amount);
    const annualRate = parseFloat(product.expectedReturn) / 100;
    const months = product.tenure;
    
    // Simple interest calculation for demonstration
    const totalReturn = principal * (1 + (annualRate * months / 12));
    const profit = totalReturn - principal;
    
    return {
      totalReturn: totalReturn.toFixed(2),
      profit: profit.toFixed(2),
      monthlyReturn: (profit / months).toFixed(2),
    };
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Investment Products</h2>
        <p className="text-neutral-600">Grow your wealth with our investment options</p>
      </div>

      {/* Active Investments */}
      {userInvestments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userInvestments.map((investment: any) => (
                <div key={investment.id} className="p-3 bg-neutral-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{investment.product?.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className="text-xs capitalize">{investment.product?.type}</Badge>
                        <Badge className={`text-xs ${getRiskColor(investment.product?.riskLevel)}`}>
                          {investment.product?.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(investment.currentValue)}</p>
                      <p className="text-xs text-success">
                        +{formatCurrency(investment.interestEarned)} earned
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-600">
                    Expected: {investment.product?.expectedReturn}% annual return
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Products */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Products</h3>
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    {getTypeIcon(product.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{product.name}</h4>
                    <p className="text-neutral-600 text-sm">{product.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="text-xs capitalize">{product.type}</Badge>
                      <Badge className={`text-xs ${getRiskColor(product.riskLevel)}`}>
                        {getRiskIcon(product.riskLevel)}
                        {product.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{product.expectedReturn}%</p>
                  <p className="text-sm text-neutral-600">Expected Return</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-neutral-600">Minimum</p>
                  <p className="font-semibold">{formatCurrency(product.minimumAmount)}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Maximum</p>
                  <p className="font-semibold">{formatCurrency(product.maximumAmount || "999999")}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Duration</p>
                  <p className="font-semibold">{product.tenure} months</p>
                </div>
              </div>

              <Dialog open={showInvestDialog && selectedProduct?.id === product.id} onOpenChange={setShowInvestDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Invest Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm mx-auto">
                  <DialogHeader>
                    <DialogTitle>Invest in {product.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Investment Amount</label>
                      <Input
                        type="number"
                        placeholder={`Min: ${formatCurrency(product.minimumAmount)}`}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                      />
                    </div>

                    {investmentAmount && calculateReturns(product, investmentAmount) && (
                      <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold">Projected Returns</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Principal:</span>
                            <span>{formatCurrency(investmentAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Return:</span>
                            <span className="font-semibold">{formatCurrency(calculateReturns(product, investmentAmount)!.totalReturn)}</span>
                          </div>
                          <div className="flex justify-between text-success">
                            <span>Profit:</span>
                            <span className="font-semibold">{formatCurrency(calculateReturns(product, investmentAmount)!.profit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Return:</span>
                            <span>{formatCurrency(calculateReturns(product, investmentAmount)!.monthlyReturn)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Important Notes:</p>
                      <ul className="space-y-1">
                        <li>• Returns are not guaranteed and subject to market conditions</li>
                        <li>• Early withdrawal may incur penalties</li>
                        <li>• Tax implications may apply to investment returns</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleInvest}
                      disabled={investMutation.isPending || !investmentAmount}
                      className="w-full"
                    >
                      {investMutation.isPending ? "Processing..." : "Confirm Investment"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}