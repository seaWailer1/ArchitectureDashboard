import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Eye, EyeOff, Copy, Lock, Unlock, Plus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VirtualCard {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  balance: string;
  isActive: boolean;
  isLocked: boolean;
  type: 'standard' | 'premium';
}

export default function VirtualCardManager() {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [cardType, setCardType] = useState<'standard' | 'premium'>('standard');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - in real app this would come from API
  const mockCard: VirtualCard = {
    id: "vc_001",
    cardNumber: "4532 1234 5678 9012",
    expiryDate: "12/26",
    cvv: "123",
    cardholderName: "John Doe",
    balance: "250.00",
    isActive: true,
    isLocked: false,
    type: 'standard'
  };

  const createCardMutation = useMutation({
    mutationFn: async (data: { type: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mockCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/virtual-cards"] });
      setShowCreateDialog(false);
      toast({
        title: "Card Created",
        description: "Your virtual card has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create virtual card",
        variant: "destructive",
      });
    },
  });

  const toggleCardLock = useMutation({
    mutationFn: async (cardId: string) => {
      await apiRequest("PUT", `/api/virtual-cards/${cardId}/toggle-lock`, {});
    },
    onSuccess: () => {
      toast({
        title: "Card Status Updated",
        description: "Card lock status has been updated",
      });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const maskCardNumber = (cardNumber: string) => {
    if (!showCardDetails) {
      return cardNumber.replace(/\d(?=\d{4})/g, "*");
    }
    return cardNumber;
  };

  const handleCreateCard = () => {
    createCardMutation.mutate({ type: cardType });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Virtual Cards</h2>
          <p className="text-neutral-600">Secure online payments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Card</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Create Virtual Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Card Type</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="standard"
                      checked={cardType === 'standard'}
                      onChange={(e) => setCardType(e.target.value as 'standard')}
                      className="text-primary"
                    />
                    <div>
                      <p className="font-medium">Standard Card</p>
                      <p className="text-xs text-neutral-600">Free • Basic features</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="premium"
                      checked={cardType === 'premium'}
                      onChange={(e) => setCardType(e.target.value as 'premium')}
                      className="text-primary"
                    />
                    <div>
                      <p className="font-medium">Premium Card</p>
                      <p className="text-xs text-neutral-600">$5/month • Enhanced security</p>
                    </div>
                  </label>
                </div>
              </div>
              <Button 
                onClick={handleCreateCard}
                disabled={createCardMutation.isPending}
                className="w-full"
              >
                {createCardMutation.isPending ? "Creating..." : "Create Card"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Virtual Card Display */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90"></div>
        <CardContent className="relative z-10 p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-6 h-6" />
              <span className="font-semibold">AfriPay Virtual</span>
            </div>
            <Badge className={`${mockCard.type === 'premium' ? 'bg-accent' : 'bg-white/20'} text-white`}>
              {mockCard.type === 'premium' ? 'Premium' : 'Standard'}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Card Number</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-mono tracking-wider">
                  {maskCardNumber(mockCard.cardNumber)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 text-white hover:bg-white/20"
                  onClick={() => copyToClipboard(mockCard.cardNumber.replace(/\s/g, ''), "Card number")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Expires</p>
                <p className="font-mono">{showCardDetails ? mockCard.expiryDate : "**/**"}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">CVV</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono">{showCardDetails ? mockCard.cvv : "***"}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-white hover:bg-white/20"
                    onClick={() => copyToClipboard(mockCard.cvv, "CVV")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-white/80 text-sm mb-1">Cardholder Name</p>
              <p className="font-medium">{mockCard.cardholderName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Controls */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex items-center justify-center space-x-2"
          onClick={() => setShowCardDetails(!showCardDetails)}
        >
          {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showCardDetails ? "Hide" : "Show"} Details</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center justify-center space-x-2"
          onClick={() => toggleCardLock.mutate(mockCard.id)}
          disabled={toggleCardLock.isPending}
        >
          {mockCard.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{mockCard.isLocked ? "Unlock" : "Lock"} Card</span>
        </Button>
      </div>

      {/* Card Balance and Top-up */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-neutral-900">
              ${parseFloat(mockCard.balance).toFixed(2)}
            </span>
            <Badge className={mockCard.isActive ? "bg-success/10 text-success" : "bg-neutral-100"}>
              {mockCard.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <div className="flex space-x-3">
            <Button className="flex-1" onClick={() => toast({ title: "Top-up", description: "Card top-up coming soon" })}>
              Top Up Card
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Transactions", description: "Card transaction history coming soon" })}>
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time notifications</span>
              <Badge className="bg-success/10 text-success">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">International payments</span>
              <Badge className="bg-accent/10 text-accent">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Online purchases</span>
              <Badge className="bg-success/10 text-success">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">ATM withdrawals</span>
              <Badge className="bg-neutral-100 text-neutral-600">Disabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}