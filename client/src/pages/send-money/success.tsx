import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, Share, Receipt } from "lucide-react";

export default function SendMoneySuccess() {
  const [, navigate] = useLocation();

  const handleDone = () => {
    navigate('/');
  };

  const handleSendAnother = () => {
    navigate('/send-money');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AfriPay Transfer',
        text: 'I just sent money using AfriPay!',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-6">
          {/* Success Icon */}
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Transfer Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your money has been sent successfully
            </p>
          </div>

          {/* Success Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount Sent</p>
                  <p className="text-3xl font-bold text-primary">$50.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">To</p>
                  <p className="font-medium text-gray-900 dark:text-white">Amara Okafor</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+234 901 234 5678</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                  <p className="text-sm font-mono text-gray-800 dark:text-gray-200">TXN-20240101-001</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleDone} className="w-full h-12">
              <Home className="w-4 h-4 mr-2" />
              Done
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleSendAnother}>
                Send Again
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button variant="ghost" className="w-full">
              <Receipt className="w-4 h-4 mr-2" />
              View Receipt
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  What's Next?
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  The recipient will receive an SMS notification and can collect the money from any AfriPay agent or withdraw to their bank account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}