import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, CreditCard, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PayBillsAccount() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setCategory(urlParams.get('category') || '');
    setProvider(urlParams.get('provider') || '');
  }, []);

  const providerInfo = {
    // Electricity
    ibedc: { name: 'IBEDC', fullName: 'Ibadan Electricity Distribution Company' },
    ekedc: { name: 'EKEDC', fullName: 'Eko Electricity Distribution Company' },
    aedc: { name: 'AEDC', fullName: 'Abuja Electricity Distribution Company' },
    phed: { name: 'PHED', fullName: 'Port Harcourt Electricity Distribution' },
    // Cable TV
    dstv: { name: 'DStv', fullName: 'Digital Satellite Television' },
    gotv: { name: 'GOtv', fullName: 'GO Television' },
    startimes: { name: 'StarTimes', fullName: 'StarTimes Cable TV' },
    // Internet
    spectranet: { name: 'Spectranet', fullName: 'Spectranet Limited' },
    smile: { name: 'Smile', fullName: 'Smile Communications' },
    // Water
    lagoswater: { name: 'Lagos Water', fullName: 'Lagos Water Corporation' },
    // Transport
    cowry: { name: 'Cowry Card', fullName: 'Cowry Card Services' },
    // Government
    firs: { name: 'FIRS', fullName: 'Federal Inland Revenue Service' }
  };

  const currentProvider = providerInfo[provider as keyof typeof providerInfo];

  const validateAccount = async () => {
    if (!accountNumber || accountNumber.length < 8) {
      toast({
        title: "Invalid Account Number",
        description: "Please enter a valid account number",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    try {
      // Simulate API call to validate account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful validation
      setCustomerName("John Doe");
      setIsValidated(true);
      toast({
        title: "Account Validated",
        description: "Customer account found successfully"
      });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Unable to validate account. Please check the number and try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleContinue = () => {
    if (!isValidated || !amount) return;
    
    const params = new URLSearchParams({
      category: category,
      provider: provider,
      account: accountNumber,
      customer: customerName,
      amount: amount
    });
    
    navigate(`/pay-bills/confirm?${params.toString()}`);
  };

  const isValidAmount = amount && parseFloat(amount) >= 100 && parseFloat(amount) <= 500000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate(`/pay-bills/providers?category=${category}`)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">{currentProvider?.name || 'Provider'} Bill</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter account details</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Provider Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">{currentProvider?.fullName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentProvider?.name} bill payment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Number */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account Number / Customer ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="account"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setIsValidated(false);
                    setCustomerName("");
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={validateAccount}
                  disabled={!accountNumber || isValidating}
                  variant="outline"
                >
                  {isValidating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>
              
              {/* Validation Status */}
              {isValidated && customerName && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Account Validated
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Customer: {customerName}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recent Accounts */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-gray-400">Recent accounts</Label>
              <div className="space-y-2">
                <button
                  onClick={() => setAccountNumber("1234567890")}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">1234567890</span>
                    <Badge variant="secondary" className="text-xs">John Doe</Badge>
                  </div>
                </button>
                <button
                  onClick={() => setAccountNumber("0987654321")}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">0987654321</span>
                    <Badge variant="secondary" className="text-xs">Jane Smith</Badge>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount */}
        {isValidated && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Amount</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦100 - ₦500,000)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                  min="100"
                  max="500000"
                />
              </div>
              
              {amount && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You will pay: <span className="font-medium">₦{amount}</span>
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Transaction fee: Free
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Important Note */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Important Notice</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Please ensure your account number is correct. Payments to wrong accounts cannot be reversed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={!isValidated || !isValidAmount}
          className="w-full h-12 text-lg"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}