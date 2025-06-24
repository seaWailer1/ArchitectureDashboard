import { useState } from "react";
import { FaCamera, FaQrcode } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import QRModal from "@/components/qr/qr-modal";

export default function QR() {
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <main className="max-w-md mx-auto px-4 pb-20">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">QR Payments</h1>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Button
              className="flex items-center justify-center space-x-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all h-auto text-left"
              variant="ghost"
              onClick={() => setShowQRModal(true)}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FaCamera className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Scan QR Code</h3>
                <p className="text-sm text-neutral-600">Scan to pay or receive money</p>
              </div>
            </Button>
            
            <Button
              className="flex items-center justify-center space-x-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all h-auto text-left"
              variant="ghost"
              onClick={() => setShowQRModal(true)}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <FaQrcode className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">Generate QR Code</h3>
                <p className="text-sm text-neutral-600">Create QR for others to pay you</p>
              </div>
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 mb-4">How to use QR Payments</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Scan to Pay</p>
                  <p className="text-sm text-neutral-600">Use camera to scan merchant QR codes and make instant payments</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Generate to Receive</p>
                  <p className="text-sm text-neutral-600">Create your QR code for others to scan and pay you</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-success text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Instant & Secure</p>
                  <p className="text-sm text-neutral-600">All QR transactions are processed instantly and securely</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation currentPage="qr" />
      
      <QRModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
      />
    </div>
  );
}
