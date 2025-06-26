import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaQrcode, FaPaperPlane, FaDownload, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { t } from "@/lib/i18n";
import QRModal from "@/components/qr/qr-modal";

export default function QuickActions() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const topUpMutation = useMutation({
    mutationFn: async (amount: string) => {
      await apiRequest("POST", "/api/wallet/topup", { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setShowTopUpDialog(false);
      setTopUpAmount("");
      toast({
        title: "Success",
        description: "FaWallet topped up successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to top up wallet",
        variant: "destructive",
      });
    },
  });

  const handleTopUp = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    topUpMutation.mutate(topUpAmount);
  };

  const actions = [
    {
      icon: FaQrcode,
      label: t('scanQR'),
      color: "bg-primary/10 text-primary",
      onClick: () => setShowQRModal(true),
    },
    {
      icon: FaPaperPlane,
      label: t('send'),
      color: "bg-accent/10 text-accent",
      onClick: () => {
        toast({
          title: "Coming Soon",
          description: "FaPaperPlane money feature coming soon",
        });
      },
    },
    {
      icon: FaDownload,
      label: t('receive'),
      color: "bg-success/10 text-success",
      onClick: () => setShowQRModal(true),
    },
    {
      icon: FaPlus,
      label: t('topUp'),
      color: "bg-secondary/10 text-secondary",
      onClick: () => setShowTopUpDialog(true),
    },
  ];

  return (
    <>
      <section className="mb-6">
        <div className="grid grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all h-auto"
                onClick={action.onClick}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-neutral-900">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </section>

      {/* QR Modal */}
      <QRModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
      />

      {/* Top Up Dialog */}
      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Top Up FaWallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowTopUpDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleTopUp}
                disabled={topUpMutation.isPending}
              >
                {topUpMutation.isPending ? "Processing..." : "Top Up"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
