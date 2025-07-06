import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Zap, Gift } from "lucide-react";

export default function BuyAirtimeAmount() {
  const [, navigate] = useLocation();
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);

  useEffect(() => {
    // Get provider from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const providerParam = urlParams.get('provider');
    if (providerParam) {
      setProvider(providerParam);
    }
  }, []);

  const quickAmounts = [
    { amount: 100, bonus: '10MB', popular: false },
    { amount: 200, bonus: '25MB', popular: true },
    { amount: 500, bonus: '100MB', popular: false },
    { amount: 1000, bonus: '500MB', popular: true },
    { amount: 2000, bonus: '1GB', popular: false },
    { amount: 5000, bonus: '3GB', popular: false }
  ];

  const providerInfo = {
    mtn: { name: 'MTN', logo: '🟡', color: 'bg-yellow-100 text-yellow-800' },
    airtel: { name: 'Airtel', logo: '🔴', color: 'bg-red-100 text-red-800' },
    glo: { name: 'Glo', logo: '🟢', color: 'bg-green-100 text-green-800' },
    etisalat: { name: '9mobile', logo: '🟣', color: 'bg-purple-100 text-purple-800' }
  };

  const currentProvider = providerInfo[provider as keyof typeof providerInfo] || providerInfo.mtn;

  const handleQuickAmountSelect = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setSelectedQuickAmount(quickAmount);
  };

  const handleCustomAmount = (value: string) => {
    setAmount(value);
    setSelectedQuickAmount(null);
  };

  const handleContinue = () => {
    if (!amount || !phoneNumber) return;
    
    const params = new URLSearchParams({
      amount: amount,
      phone: phoneNumber,
      provider: provider
    });
    
    navigate(`/buy-airtime/confirm?${params.toString()}`);
  };

  const isValidAmount = amount && parseInt(amount) >= 50 && parseInt(amount) <= 50000;
  const isValidPhone = phoneNumber && phoneNumber.length >= 11;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/buy-airtime')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Buy Airtime</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter amount and phone number</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Selected Provider */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl">
                {currentProvider.logo}
              </div>
              <div>
                <h3 className="font-medium">{currentProvider.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Selected network provider</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Number */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Phone Number</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Enter phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-lg"
              />
            </div>
            
            {/* Recent Numbers */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-gray-400">Recent numbers</Label>
              <div className="space-y-2">
                <button
                  onClick={() => setPhoneNumber("08031234567")}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">08031234567</span>
                    <Badge variant="secondary" className="text-xs">MTN</Badge>
                  </div>
                </button>
                <button
                  onClick={() => setPhoneNumber("08059876543")}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">08059876543</span>
                    <Badge variant="secondary" className="text-xs">Airtel</Badge>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Amounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Amounts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((item) => (
                <Button
                  key={item.amount}
                  variant={selectedQuickAmount === item.amount ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center space-y-1 relative"
                  onClick={() => handleQuickAmountSelect(item.amount)}
                >
                  {item.popular && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-green-500">
                      Popular
                    </Badge>
                  )}
                  <span className="font-semibold">₦{item.amount}</span>
                  <span className="text-xs text-green-600 flex items-center">
                    <Gift className="w-3 h-3 mr-1" />
                    +{item.bonus}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Amount */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Custom Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Enter amount (₦50 - ₦50,000)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                className="text-lg"
                min="50"
                max="50000"
              />
            </div>
            
            {amount && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You will pay: <span className="font-medium">₦{amount}</span>
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Includes 0% transaction fee
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={!isValidAmount || !isValidPhone}
          className="w-full h-12 text-lg"
        >
          Continue to Confirmation
        </Button>
      </div>
    </div>
  );
}