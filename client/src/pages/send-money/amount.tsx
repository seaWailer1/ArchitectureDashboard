import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, DollarSign, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SendMoneyAmount() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/send-money/amount");
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  // Get recipient info from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const recipientName = urlParams.get('recipient') || '';
  const recipientPhone = urlParams.get('phone') || '';

  // Fetch user's wallet
  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets'],
  });

  // Quick amounts
  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const primaryWallet = wallets?.find(w => w.walletType === 'primary');
  const availableBalance = parseFloat(primaryWallet?.balance || '0');

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    
    const transferData = {
      recipient: recipientName,
      phone: recipientPhone,
      amount: parseFloat(amount),
      message: message
    };

    navigate(`/send-money/confirm?${new URLSearchParams({
      recipient: recipientName,
      phone: recipientPhone,
      amount: amount,
      message: message
    }).toString()}`);
  };

  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/send-money')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Send Money</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter amount</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Recipient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sending to</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {recipientName || "New Recipient"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recipientPhone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Balance */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-primary">
                ${availableBalance.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enter Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-xl h-14 text-center font-medium"
                step="0.01"
                min="0.01"
                max={availableBalance}
              />
            </div>
            
            {/* Quick amounts */}
            <div>
              <p className="text-sm font-medium mb-3">Quick amounts</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="h-10"
                    disabled={quickAmount > availableBalance}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Validation */}
            {amount && parseFloat(amount) > availableBalance && (
              <div className="text-sm text-red-600 dark:text-red-400">
                Amount exceeds available balance
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add a message (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What's this for?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/100 characters
            </p>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="sticky bottom-4">
          <Button
            onClick={handleContinue}
            disabled={!isValidAmount}
            className="w-full h-12 text-lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}