import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  QrCode, 
  Camera, 
  Upload, 
  Scan,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PayScanProps {
  onBack: () => void;
}

export default function PayScan({ onBack }: PayScanProps) {
  const [activeTab, setActiveTab] = useState('scan');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [qrData, setQrData] = useState('');
  const [showQrAmount, setShowQrAmount] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's wallet
  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets'],
  });

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  // Generate QR code for receiving payments
  const generateQRCode = () => {
    const qrPayload = {
      type: 'payment_request',
      recipientId: user?.id,
      recipientName: `${user?.firstName} ${user?.lastName}`,
      amount: amount ? parseFloat(amount) : null,
      description: description || 'Payment request',
      timestamp: Date.now(),
    };
    
    setQrData(JSON.stringify(qrPayload));
    toast({
      title: "QR Code Generated",
      description: "Share this QR code to receive payments",
    });
  };

  // Simulate QR code scanning
  const simulateQrScan = () => {
    // Mock scanned QR data
    const mockQrData = {
      type: 'payment_request',
      recipientId: 'merchant-123',
      recipientName: 'Kwame\'s Store',
      amount: 25.50,
      description: 'Coffee and pastry',
      timestamp: Date.now(),
    };
    
    setScannedData(mockQrData);
    setPaymentStep(2);
  };

  // Process payment
  const paymentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/transactions', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      setPaymentStep(3);
      toast({
        title: "Payment successful!",
        description: `$${scannedData?.amount} paid to ${scannedData?.recipientName}`,
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
    const primaryWallet = wallets?.find(w => w.walletType === 'primary');
    if (!primaryWallet) {
      toast({
        title: "No wallet found",
        description: "Please set up a wallet first",
        variant: "destructive",
      });
      return;
    }

    const transactionData = {
      type: 'payment',
      amount: scannedData.amount,
      currency: 'USD',
      recipientId: scannedData.recipientId,
      description: scannedData.description,
      fromWalletId: primaryWallet.id,
    };

    paymentMutation.mutate(transactionData);
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrData);
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard",
    });
  };

  const shareQRCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Payment Request',
        text: `Pay me $${amount || '(amount)'} - ${description || 'Payment request'}`,
        url: `afriPay://pay?data=${encodeURIComponent(qrData)}`,
      });
    } else {
      copyQRData();
    }
  };

  const primaryWallet = wallets?.find(w => w.walletType === 'primary');
  const availableBalance = parseFloat(primaryWallet?.balance || '0');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">Pay & Scan</h2>
          <p className="text-sm text-gray-600">Scan QR codes or create payment requests</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Scan to Pay</TabsTrigger>
          <TabsTrigger value="receive">Receive Payment</TabsTrigger>
        </TabsList>

        {/* Scan to Pay Tab */}
        <TabsContent value="scan" className="space-y-4">
          {paymentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <p className="text-sm text-gray-600">Point your camera at a QR code to pay</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera View Placeholder */}
                <div className="relative aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                    <div className="w-48 h-48 border-2 border-primary rounded-lg mx-auto relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={simulateQrScan} className="flex-1">
                    <Scan className="w-4 h-4 mr-2" />
                    Simulate Scan
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      // Simulate processing uploaded QR image
                      setTimeout(() => simulateQrScan(), 1000);
                    }
                  }}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Make sure the QR code is clear and well-lit for best results
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentStep === 2 && scannedData && (
            <Card>
              <CardHeader>
                <CardTitle>Confirm Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pay to</span>
                    <span className="font-medium">{scannedData.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-lg">${scannedData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description</span>
                    <span className="font-medium">{scannedData.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Balance</span>
                    <span className="font-medium">${availableBalance.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-lg">${scannedData.amount}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setPaymentStep(1)} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handlePayment} 
                    className="flex-1"
                    disabled={paymentMutation.isPending || scannedData.amount > availableBalance}
                  >
                    {paymentMutation.isPending ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentStep === 3 && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  ${scannedData?.amount} paid to {scannedData?.recipientName}
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm">TXN{Date.now()}</span>
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
                  <Button onClick={() => setPaymentStep(1)} className="flex-1">
                    Scan Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Receive Payment Tab */}
        <TabsContent value="receive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Payment Request</CardTitle>
              <p className="text-sm text-gray-600">Generate a QR code for others to pay you</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Amount (Optional)</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty for flexible amount</p>
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="What's this payment for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button onClick={generateQRCode} className="w-full">
                <QrCode className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>

              {qrData && (
                <div className="space-y-4">
                  {/* QR Code Display */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                    <div className="w-48 h-48 bg-gray-100 border border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      {amount && (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-2xl font-bold">${amount}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowQrAmount(!showQrAmount)}
                          >
                            {showQrAmount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      )}
                      {description && (
                        <p className="text-sm text-gray-600">{description}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" onClick={shareQRCode}>
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyQRData}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      QR code is ready! Share it with anyone you want to receive payment from.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}