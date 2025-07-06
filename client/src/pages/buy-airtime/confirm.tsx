import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Phone, CreditCard, Clock, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BuyAirtimeConfirm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    // Get params from URL
    const urlParams = new URLSearchParams(window.location.search);
    setAmount(urlParams.get('amount') || '');
    setPhone(urlParams.get('phone') || '');
    setProvider(urlParams.get('provider') || 'mtn');
  }, []);

  const providerInfo = {
    mtn: { name: 'MTN', logo: '🟡', color: 'bg-yellow-100 text-yellow-800' },
    airtel: { name: 'Airtel', logo: '🔴', color: 'bg-red-100 text-red-800' },
    glo: { name: 'Glo', logo: '🟢', color: 'bg-green-100 text-green-800' },
    etisalat: { name: '9mobile', logo: '🟣', color: 'bg-purple-100 text-purple-800' }
  };

  const currentProvider = providerInfo[provider as keyof typeof providerInfo] || providerInfo.mtn;
  const amountNum = parseInt(amount);
  const bonus = getBonus(amountNum);
  const transactionFee = 0;
  const total = amountNum + transactionFee;

  function getBonus(amount: number): string {
    if (amount >= 5000) return '3GB';
    if (amount >= 2000) return '1GB';
    if (amount >= 1000) return '500MB';
    if (amount >= 500) return '100MB';
    if (amount >= 200) return '25MB';
    if (amount >= 100) return '10MB';
    return '0MB';
  }

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page
      const params = new URLSearchParams({
        amount: amount,
        phone: phone,
        provider: provider,
        reference: `ATM${Date.now()}`
      });
      
      navigate(`/buy-airtime/success?${params.toString()}`);
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Unable to process your airtime purchase. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/buy-airtime/amount')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Confirm Purchase</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review your airtime purchase</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Purchase Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Network Provider</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm">
                  {currentProvider.logo}
                </div>
                <span className="font-medium">{currentProvider.name}</span>
              </div>
            </div>
            
            <Separator />
            
            {/* Phone Number */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Phone Number</span>
              <span className="font-medium">{phone}</span>
            </div>
            
            <Separator />
            
            {/* Amount */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Airtime Amount</span>
              <span className="font-medium">₦{amount}</span>
            </div>
            
            {/* Bonus */}
            {bonus !== '0MB' && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bonus Data</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +{bonus} FREE
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Airtime Amount</span>
              <span>₦{amount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Transaction Fee</span>
              <span className="text-green-600">Free</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>₦{total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">AfriPay Wallet</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Balance: ₦25,480.00</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Secure Transaction</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your payment is protected with bank-level encryption and will be processed instantly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        <Button 
          onClick={handleConfirmPurchase}
          disabled={isProcessing}
          className="w-full h-12 text-lg"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Confirm Purchase - ₦${total}`
          )}
        </Button>
      </div>
    </div>
  );
}