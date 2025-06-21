import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Camera, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { t } from "@/lib/i18n";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRModal({ isOpen, onClose }: QRModalProps) {
  const [mode, setMode] = useState<'scan' | 'generate'>('scan');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const { toast } = useToast();

  const generateQRMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/qr/generate", {
        amount: amount || null,
        description: description || "Payment request"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedQR(data.qrCode);
      toast({
        title: "Success",
        description: "QR code generated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    },
  });

  const handleGenerateQR = () => {
    generateQRMutation.mutate();
  };

  const handleOpenCamera = () => {
    toast({
      title: "Camera Access",
      description: "Camera integration will be implemented with device camera APIs",
    });
  };

  const resetModal = () => {
    setMode('scan');
    setAmount('');
    setDescription('');
    setGeneratedQR(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            {mode === 'scan' ? t('scanQRCode') : t('generateQR')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-neutral-600 hover:text-neutral-900"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {mode === 'scan' ? (
          <>
            <div className="bg-neutral-100 rounded-xl p-8 text-center mb-4">
              <div className="w-32 h-32 mx-auto border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-600 mt-3">{t('cameraWillOpen')}</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => setMode('generate')}
              >
                {t('generateQR')}
              </Button>
              <Button 
                className="flex-1"
                onClick={handleOpenCamera}
              >
                {t('openCamera')}
              </Button>
            </div>
          </>
        ) : (
          <>
            {!generatedQR ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (Optional)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Payment for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setMode('scan')}
                  >
                    Back to Scan
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleGenerateQR}
                    disabled={generateQRMutation.isPending}
                  >
                    {generateQRMutation.isPending ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-neutral-100 rounded-xl p-8 mb-4">
                  <div className="w-32 h-32 mx-auto border border-neutral-300 rounded-lg flex items-center justify-center bg-white">
                    <QrCode className="w-16 h-16 text-neutral-600" />
                  </div>
                  <p className="text-xs text-neutral-600 mt-2 break-all">
                    QR: {generatedQR.slice(0, 20)}...
                  </p>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={resetModal}
                >
                  Generate New QR
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
