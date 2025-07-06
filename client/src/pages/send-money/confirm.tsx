import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, DollarSign, MessageSquare, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SendMoneyConfirm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get transfer details from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const recipientName = urlParams.get('recipient') || '';
  const recipientPhone = urlParams.get('phone') || '';
  const amount = urlParams.get('amount') || '';
  const message = urlParams.get('message') || '';

  // Fetch user's wallet
  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets'],
  });

  const sendMoneyMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/transactions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      navigate('/send-money/success');
      toast({
        title: "Money sent successfully!",
        description: `$${amount} sent to ${recipientName}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer failed",
        description: error.message || "Unable to send money. Please try again.",
        variant: "destructive",
      });
    },
  });

  const primaryWallet = wallets?.find(w => w.walletType === 'primary');
  const availableBalance = parseFloat(primaryWallet?.balance || '0');
  const transferAmount = parseFloat(amount);
  const fee = 0.99; // Fixed transfer fee
  const totalAmount = transferAmount + fee;

  const handleConfirmTransfer = () => {
    if (!primaryWallet) {
      toast({
        title: "No wallet found",
        description: "Please set up a wallet first",
        variant: "destructive",
      });
      return;
    }

    const transactionData = {
      type: 'send',
      amount: transferAmount,
      currency: 'USD',
      recipientPhone: recipientPhone,
      description: message || `Transfer to ${recipientName}`,
      fromWalletId: primaryWallet.id,
    };

    setIsProcessing(true);
    sendMoneyMutation.mutate(transactionData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Confirm Transfer</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review details</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Transfer Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transfer Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recipient */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {recipientName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recipientPhone}
                </p>
              </div>
              <Badge variant="outline">Recipient</Badge>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-3 border-t border-b">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Transfer Amount</span>
              </div>
              <span className="text-xl font-bold text-primary">
                ${transferAmount.toFixed(2)}
              </span>
            </div>

            {/* Message */}
            {message && (
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Message</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {message}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Transfer amount</span>
              <span>${transferAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Transfer fee</span>
              <span>${fee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between font-medium text-lg">
                <span>Total</span>
                <span className="text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Balance check */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Available balance</span>
                <span>${availableBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>After transfer</span>
                <span className={availableBalance - totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${(availableBalance - totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Secure Transfer
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  This transfer will be processed securely. The recipient will be notified via SMS.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="sticky bottom-4 space-y-3">
          <Button
            onClick={handleConfirmTransfer}
            disabled={totalAmount > availableBalance || isProcessing || sendMoneyMutation.isPending}
            className="w-full h-12 text-lg"
          >
            {isProcessing || sendMoneyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Send $${transferAmount.toFixed(2)}`
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isProcessing || sendMoneyMutation.isPending}
            className="w-full"
          >
            Back to Edit
          </Button>
        </div>
      </div>
    </div>
  );
}