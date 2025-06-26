import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Send, 
  Users, 
  Phone, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Search,
  Star,
  Banknote
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

interface SendMoneyProps {
  onBack: () => void;
}

export default function SendMoney({ onBack }: SendMoneyProps) {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sendMethod, setSendMethod] = useState('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's wallet
  const { data: wallets } = useQuery({
    queryKey: ['/api/wallets'],
  });

  // Mock recent contacts for demonstration
  const recentContacts = [
    { id: 1, name: "Amara Okafor", phone: "+234 901 234 5678", avatar: "AO", lastSent: "2 days ago" },
    { id: 2, name: "Kwame Asante", phone: "+233 244 567 890", avatar: "KA", lastSent: "1 week ago" },
    { id: 3, name: "Fatima Hassan", phone: "+221 77 123 4567", avatar: "FH", lastSent: "3 days ago" },
    { id: 4, name: "Joseph Mbeki", phone: "+27 82 345 6789", avatar: "JM", lastSent: "5 days ago" },
  ];

  // Mock quick amounts
  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const sendMoneyMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/transactions', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      setStep(4);
      toast({
        title: "Money sent successfully!",
        description: `$${amount} sent to ${selectedContact?.name || recipient}`,
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

  const handleSendMoney = () => {
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
      type: 'send',
      amount: parseFloat(amount),
      currency: 'USD',
      recipientPhone: selectedContact?.phone || recipient,
      description: message || `Transfer to ${selectedContact?.name || recipient}`,
      fromWalletId: primaryWallet.id,
    };

    sendMoneyMutation.mutate(transactionData);
  };

  const filteredContacts = recentContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

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
          <h2 className="font-bold text-lg">Send Money</h2>
          <p className="text-sm text-gray-600">Transfer money to friends and family</p>
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
              <CardTitle>Choose Recipient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={sendMethod} onValueChange={setSendMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="phone">Phone Number</TabsTrigger>
                  <TabsTrigger value="contacts">Recent Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="phone" className="space-y-4">
                  <div>
                    <Label>Phone Number</Label>
                    <div className="flex space-x-2 mt-2">
                      <Select defaultValue="+234">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+234">+234</SelectItem>
                          <SelectItem value="+233">+233</SelectItem>
                          <SelectItem value="+254">+254</SelectItem>
                          <SelectItem value="+27">+27</SelectItem>
                          <SelectItem value="+221">+221</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="901 234 5678"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedContact?.id === contact.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                            {contact.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Last sent</p>
                            <p className="text-xs text-gray-600">{contact.lastSent}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!recipient && !selectedContact}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Enter Amount */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Banknote className="w-4 h-4" />
                <span>Available: ${availableBalance.toFixed(2)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Amount (USD)</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-2xl h-14"
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

              <div>
                <Label>Message (Optional)</Label>
                <Input
                  placeholder="What's this for?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="flex-1"
                  disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirm Transfer */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">To</span>
                  <span className="font-medium">{selectedContact?.name || recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{selectedContact?.phone || recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-lg">${amount}</span>
                </div>
                {message && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Message</span>
                    <span className="font-medium">{message}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-lg">${amount}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSendMoney} 
                  className="flex-1"
                  disabled={sendMoneyMutation.isPending}
                >
                  {sendMoneyMutation.isPending ? "Sending..." : "Send Money"}
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
              <h3 className="text-xl font-bold mb-2">Money Sent Successfully!</h3>
              <p className="text-gray-600 mb-4">
                ${amount} has been sent to {selectedContact?.name || recipient}
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
                <Button onClick={() => setStep(1)} className="flex-1">
                  Send Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}