import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, FaCreditCard, QrCode, Shield } from "react-icons/fa";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Coins className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AfriPay</h1>
        <p className="text-white/80 text-lg">Pan-African Fintech SuperApp</p>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to the Future of African Finance
            </h2>
            <p className="text-white/80">
              Multi-role wallet, QR payments, and ecosystem services all in one app
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <QrCode className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-medium">QR Payments</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <FaCreditCard className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Multi-Role Wallet</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Secure KYC</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Mini-Apps</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-6 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
          
          <p className="text-center text-white/60 text-sm mt-4">
            Available in English, French, Arabic, and Swahili
          </p>
        </div>
      </div>
    </div>
  );
}
