import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Phone, Home, RotateCcw, Share2, Download, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BuyAirtimeSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    // Get params from URL
    const urlParams = new URLSearchParams(window.location.search);
    setAmount(urlParams.get('amount') || '');
    setPhone(urlParams.get('phone') || '');
    setProvider(urlParams.get('provider') || 'mtn');
    setReference(urlParams.get('reference') || '');
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
  const transactionDate = new Date().toLocaleString();

  function getBonus(amount: number): string {
    if (amount >= 5000) return '3GB';
    if (amount >= 2000) return '1GB';
    if (amount >= 1000) return '500MB';
    if (amount >= 500) return '100MB';
    if (amount >= 200) return '25MB';
    if (amount >= 100) return '10MB';
    return '0MB';
  }

  const handleShareReceipt = () => {
    toast({
      title: "Receipt Shared",
      description: "Transaction receipt has been shared successfully"
    });
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Transaction receipt has been downloaded to your device"
    });
  };

  const handleBuyAgain = () => {
    const params = new URLSearchParams({
      amount: amount,
      phone: phone,
      provider: provider
    });
    navigate(`/buy-airtime/confirm?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">
              Airtime Purchase Successful!
            </h1>
            <p className="text-green-600 dark:text-green-400 mt-2">
              Your airtime has been sent to {phone}
            </p>
          </div>
        </div>

        {/* Transaction Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Transaction Summary</span>
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
                    <Gift className="w-3 h-3 mr-1" />
                    +{bonus} FREE
                  </Badge>
                </div>
              </>
            )}
            
            <Separator />
            
            {/* Reference */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Reference</span>
              <span className="font-mono text-sm">{reference}</span>
            </div>
            
            <Separator />
            
            {/* Date */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
              <span className="text-sm">{transactionDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Airtime Delivered Successfully
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {bonus !== '0MB' ? `₦${amount} airtime + ${bonus} bonus data has been credited to ${phone}` : `₦${amount} airtime has been credited to ${phone}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={handleShareReceipt}
            className="h-12 flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Receipt</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDownloadReceipt}
            className="h-12 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleBuyAgain}
            className="w-full h-12 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Buy Again</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/buy-airtime')}
            className="w-full h-12"
          >
            Buy Airtime for Another Number
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full h-12 flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}