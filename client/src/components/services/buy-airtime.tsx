import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Smartphone, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Phone,
  DollarSign,
  Star,
  Search,
  Zap
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

interface BuyAirtimeProps {
  onBack: () => void;
}

export default function BuyAirtime({ onBack }: BuyAirtimeProps) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [amount, setAmount] = useState('');
  const [isForSelf, setIsForSelf] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's wallet and profile
  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets'],
  });

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  // Mock network operators data
  const operators = [
    {
      id: 'mtn',
      name: 'MTN',
      logo: '📱',
      countries: ['Nigeria', 'Ghana', 'South Africa'],
      prefixes: ['0803', '0806', '0810', '0813', '0814', '0816', '0903', '0906'],
      color: '#FFD700',
      discount: 2
    },
    {
      id: 'airtel',
      name: 'Airtel',
      logo: '📶',
      countries: ['Nigeria', 'Kenya', 'Uganda'],
      prefixes: ['0802', '0808', '0812', '0701', '0708', '0902', '0907'],
      color: '#FF4444',
      discount: 3
    },
    {
      id: 'glo',
      name: 'Glo',
      logo: '🌐',
      countries: ['Nigeria', 'Ghana'],
      prefixes: ['0805', '0807', '0811', '0815', '0905', '0915'],
      color: '#00AA44',
      discount: 1
    },
    {
      id: '9mobile',
      name: '9mobile',
      logo: '📞',
      countries: ['Nigeria'],
      prefixes: ['0809', '0817', '0818', '0909', '0908'],
      color: '#0066CC',
      discount: 2
    },
    {
      id: 'safaricom',
      name: 'Safaricom',
      logo: '🦁',
      countries: ['Kenya'],
      prefixes: ['0722', '0723', '0724', '0727', '0728', '0729'],
      color: '#00AA00',
      discount: 1
    }
  ];

  // Quick amounts for airtime
  const quickAmounts = [5, 10, 20, 50, 100, 200];

  // Recent contacts for demo
  const recentContacts = [
    { id: 1, name: "Amara Okafor", phone: "+234 803 123 4567", operator: "mtn", lastTopup: "2 days ago" },
    { id: 2, name: "Kwame Asante", phone: "+233 244 567 890", operator: "mtn", lastTopup: "1 week ago" },
    { id: 3, name: "Fatima Hassan", phone: "+221 77 123 4567", operator: "airtel", lastTopup: "3 days ago" },
    { id: 4, name: "Joseph Mbeki", phone: "+27 82 345 6789", operator: "mtn", lastTopup: "5 days ago" },
  ];

  // Auto-detect operator from phone number
  const detectOperator = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const prefix = cleanPhone.substring(cleanPhone.length - 10, cleanPhone.length - 7);
    
    for (const operator of operators) {
      if (operator.prefixes.some(p => prefix.startsWith(p.substring(1)))) {
        setSelectedOperator(operator.id);
        return;
      }
    }
    setSelectedOperator('');
  };

  const buyAirtimeMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/airtime/purchase', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      setStep(4);
      toast({
        title: "Airtime purchased successfully!",
        description: `$${amount} airtime sent to ${selectedContact?.name || phoneNumber}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Unable to purchase airtime. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = () => {
    const primaryWallet = wallets?.find(w => w.walletType === 'primary');
    if (!primaryWallet) {
      toast({
        title: "No wallet found",
        description: "Please set up a wallet first",
        variant: "destructive",
      });
      return;
    }

    const purchaseData = {
      phoneNumber: selectedContact?.phone || phoneNumber,
      operator: selectedOperator,
      amount: parseFloat(amount),
      currency: 'USD',
      fromWalletId: primaryWallet.id,
    };

    buyAirtimeMutation.mutate(purchaseData);
  };

  const filteredContacts = recentContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const selectedOperatorData = operators.find(op => op.id === selectedOperator);
  const primaryWallet = wallets?.find(w => w.walletType === 'primary');
  const availableBalance = parseFloat(primaryWallet?.balance || '0');
  const finalAmount = amount ? parseFloat(amount) : 0;
  const discount = selectedOperatorData?.discount || 0;
  const discountAmount = (finalAmount * discount) / 100;
  const totalAmount = finalAmount - discountAmount;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">Buy Airtime</h2>
          <p className="text-sm text-gray-600">Top up mobile phone credit instantly</p>
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

      {/* Step 1: Select Recipient */}
      {step === 1 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose Number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={isForSelf ? 'self' : 'others'} onValueChange={(value) => setIsForSelf(value === 'self')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="self">My Number</TabsTrigger>
                  <TabsTrigger value="others">Other Numbers</TabsTrigger>
                </TabsList>

                <TabsContent value="self" className="space-y-4">
                  <div>
                    <Label>Your Phone Number</Label>
                    <Input
                      placeholder="+234 803 123 4567"
                      value={user?.phoneNumber || phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        detectOperator(e.target.value);
                      }}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="others" className="space-y-4">
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+234 803 123 4567"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        detectOperator(e.target.value);
                      }}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Recent Numbers</Label>
                    <div className="relative mt-2 mb-3">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedContact?.id === contact.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedContact(contact);
                            setPhoneNumber(contact.phone);
                            setSelectedOperator(contact.operator);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-gray-600">{contact.phone}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs">
                                {operators.find(op => op.id === contact.operator)?.name}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">{contact.lastTopup}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!phoneNumber}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Select Operator and Amount */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Operator & Amount</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{selectedContact?.name || phoneNumber}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Network Operator</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {operators.map((operator) => (
                    <div
                      key={operator.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedOperator === operator.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedOperator(operator.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{operator.logo}</span>
                        <div className="flex-1">
                          <p className="font-medium">{operator.name}</p>
                          <p className="text-xs text-gray-600">{operator.countries.join(', ')}</p>
                        </div>
                        {operator.discount > 0 && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            {operator.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
              </div>

              <div>
                <Label>Quick Amounts</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`${amount === quickAmount.toString() ? 'border-primary bg-primary/5' : ''}`}
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedOperatorData && amount && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Instant Delivery</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {selectedOperatorData.discount > 0 && (
                      <>Save ${discountAmount.toFixed(2)} with {selectedOperatorData.name}! </>
                    )}
                    Airtime will be delivered instantly to {selectedContact?.name || phoneNumber}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="flex-1"
                  disabled={!selectedOperator || !amount || parseFloat(amount) <= 0}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm Purchase */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{selectedOperatorData?.logo}</span>
                  <div>
                    <p className="font-medium">{selectedOperatorData?.name}</p>
                    <p className="text-sm text-gray-600">{selectedContact?.name || phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Airtime Amount</span>
                  <span className="font-medium">${finalAmount.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium">$0.00</span>
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
                  Airtime will be delivered instantly after payment confirmation
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handlePurchase} 
                  className="flex-1"
                  disabled={buyAirtimeMutation.isPending || totalAmount > availableBalance}
                >
                  {buyAirtimeMutation.isPending ? "Processing..." : "Buy Airtime"}
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
              <h3 className="text-xl font-bold mb-2">Airtime Purchased!</h3>
              <p className="text-gray-600 mb-4">
                ${finalAmount} airtime has been sent to {selectedContact?.name || phoneNumber}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">ATM{Date.now()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Network</span>
                  <span className="text-sm">{selectedOperatorData?.name}</span>
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
                  Buy Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}