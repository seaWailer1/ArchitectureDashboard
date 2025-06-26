import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Zap, 
  Tv, 
  Wifi, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Receipt,
  CreditCard,
  Phone,
  Home,
  Gamepad2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PayBillsProps {
  onBack: () => void;
}

export default function PayBills({ onBack }: PayBillsProps) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's wallet
  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets'],
  });

  // Bill categories and providers
  const billCategories = [
    {
      id: 'utilities',
      name: 'Utilities',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      providers: [
        { id: 'eko-electric', name: 'Eko Electricity Distribution', type: 'prepaid/postpaid', fee: 0.5 },
        { id: 'ibadan-electric', name: 'Ibadan Electricity Distribution', type: 'prepaid/postpaid', fee: 0.5 },
        { id: 'abuja-electric', name: 'Abuja Electricity Distribution', type: 'prepaid/postpaid', fee: 0.5 },
        { id: 'lagos-water', name: 'Lagos Water Corporation', type: 'monthly', fee: 1.0 },
      ]
    },
    {
      id: 'telecom',
      name: 'Telecom & Internet',
      icon: Phone,
      color: 'bg-blue-100 text-blue-600',
      providers: [
        { id: 'mtn-postpaid', name: 'MTN Postpaid', type: 'monthly', fee: 0.25 },
        { id: 'airtel-postpaid', name: 'Airtel Postpaid', type: 'monthly', fee: 0.25 },
        { id: 'glo-postpaid', name: 'Glo Postpaid', type: 'monthly', fee: 0.25 },
        { id: 'spectranet', name: 'Spectranet Internet', type: 'monthly', fee: 1.0 },
        { id: 'swift-internet', name: 'Swift Networks', type: 'monthly', fee: 1.0 },
      ]
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: Tv,
      color: 'bg-purple-100 text-purple-600',
      providers: [
        { id: 'dstv', name: 'DStv', type: 'monthly', fee: 1.0 },
        { id: 'gotv', name: 'GOtv', type: 'monthly', fee: 0.5 },
        { id: 'startimes', name: 'StarTimes', type: 'monthly', fee: 0.5 },
        { id: 'netflix', name: 'Netflix', type: 'monthly', fee: 0.0 },
        { id: 'spotify', name: 'Spotify', type: 'monthly', fee: 0.0 },
      ]
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: Gamepad2,
      color: 'bg-green-100 text-green-600',
      providers: [
        { id: 'playstation', name: 'PlayStation Network', type: 'subscription', fee: 0.0 },
        { id: 'xbox-live', name: 'Xbox Live Gold', type: 'subscription', fee: 0.0 },
        { id: 'steam-wallet', name: 'Steam Wallet', type: 'top-up', fee: 0.0 },
      ]
    }
  ];

  // Recent bills for demo
  const recentBills = [
    { id: 1, provider: 'Eko Electric', account: '1234567890', amount: 25.50, dueDate: '2024-01-30', status: 'pending' },
    { id: 2, provider: 'DStv', account: 'IUC123456789', amount: 45.00, dueDate: '2024-02-05', status: 'paid' },
    { id: 3, provider: 'MTN Postpaid', account: '+234 803 123 4567', amount: 15.75, dueDate: '2024-02-10', status: 'pending' },
  ];

  const selectedCategoryData = billCategories.find(cat => cat.id === selectedCategory);
  const selectedProviderData = selectedCategoryData?.providers.find(p => p.id === selectedProvider);

  // Simulate customer info validation
  const validateCustomer = () => {
    // Mock customer validation
    const mockCustomerInfo = {
      name: 'Amara Okafor',
      address: '123 Lagos Street, Victoria Island',
      accountType: selectedProviderData?.type || 'prepaid',
      outstandingAmount: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 50) + 10,
      lastPayment: '2024-01-15',
    };
    
    setCustomerInfo(mockCustomerInfo);
    setStep(3);
  };

  const payBillMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/bills/payment', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      setStep(4);
      toast({
        title: "Bill payment successful!",
        description: `$${amount} paid to ${selectedProviderData?.name}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment failed",
        description: error.message || "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    const primaryWallet = wallets?.find((w: any) => w.walletType === 'primary');
    if (!primaryWallet) {
      toast({
        title: "No wallet found",
        description: "Please set up a wallet first",
        variant: "destructive",
      });
      return;
    }

    const paymentData = {
      category: selectedCategory,
      provider: selectedProvider,
      accountNumber,
      amount: parseFloat(amount),
      currency: 'USD',
      fromWalletId: primaryWallet.id,
    };

    payBillMutation.mutate(paymentData);
  };

  const primaryWallet = wallets?.find((w: any) => w.walletType === 'primary');
  const availableBalance = parseFloat(primaryWallet?.balance || '0');
  const totalAmount = amount ? parseFloat(amount) + (selectedProviderData?.fee || 0) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">Pay Bills</h2>
          <p className="text-sm text-gray-600">Pay utilities, subscriptions and services</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className={`flex items-center ${stepNum < 4 ? 'flex-1' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`h-1 flex-1 mx-2 ${
                step > stepNum ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Category and Provider */}
      {step === 1 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="utilities">Utilities</TabsTrigger>
                  <TabsTrigger value="entertainment">TV & Media</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 mt-2">
                  <TabsTrigger value="telecom">Internet</TabsTrigger>
                  <TabsTrigger value="gaming">Gaming</TabsTrigger>
                </TabsList>

                {billCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="space-y-3">
                    <div className="grid gap-3">
                      {category.providers.map((provider) => (
                        <div
                          key={provider.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedProvider === provider.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedProvider(provider.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{provider.name}</p>
                              <p className="text-sm text-gray-600 capitalize">{provider.type}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs">
                                Fee: ${provider.fee}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!selectedProvider}
              >
                Continue
              </Button>
            </CardContent>
          </Card>

          {/* Recent Bills */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{bill.provider}</p>
                      <p className="text-sm text-gray-600">{bill.account}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${bill.amount}</p>
                      <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                        {bill.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Enter Account Details */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <p className="text-sm text-gray-600">{selectedProviderData?.name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Account Number / Customer ID</Label>
                <Input
                  placeholder={selectedCategory === 'utilities' ? 'Meter number' : 
                             selectedCategory === 'entertainment' ? 'IUC/Smartcard number' : 
                             'Account number'}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Amount (USD)</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-xl h-14"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Service fee: ${selectedProviderData?.fee || 0}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={validateCustomer} 
                  className="flex-1"
                  disabled={!accountNumber || !amount || parseFloat(amount) <= 0}
                >
                  Validate Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm Payment */}
      {step === 3 && customerInfo && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span>{customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account</span>
                    <span>{accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="capitalize">{customerInfo.accountType}</span>
                  </div>
                  {customerInfo.outstandingAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Outstanding</span>
                      <span>${customerInfo.outstandingAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{selectedProviderData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${selectedProviderData?.fee || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="font-medium">${availableBalance.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Payment will be processed instantly
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handlePayment} 
                  className="flex-1"
                  disabled={payBillMutation.isPending || totalAmount > availableBalance}
                >
                  {payBillMutation.isPending ? "Processing..." : "Pay Bill"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                ${amount} paid to {selectedProviderData?.name}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">BILL{Date.now()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Account</span>
                  <span className="text-sm">{accountNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Done
                </Button>
                <Button onClick={() => setStep(1)} className="flex-1">
                  Pay Another Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}