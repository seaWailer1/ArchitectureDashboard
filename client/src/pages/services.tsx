import { useState } from "react";
import { Car, ShoppingBag, Zap, Smartphone, CreditCard, Building, Users, MoreHorizontal, Package, Send, QrCode, Phone, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import LoanApplication from "@/components/loans/loan-application";
import VirtualCardManager from "@/components/virtual-card/virtual-card";
import CryptoTrading from "@/components/crypto/crypto-trading";
import InvestmentProducts from "@/components/investment/investment-products";
import AdminDashboard from "@/components/admin/admin-dashboard";
import MultiCurrencyTrading from "@/components/trading/multi-currency-trading";
import BillPayments from "@/components/services/bill-payments";
import ShoppingMarketplace from "@/components/services/shopping-marketplace";
import RideHailing from "@/components/services/ride-hailing";
import DeliveryService from "@/components/services/delivery-service";
import MerchantDashboard from "@/components/ecommerce/merchant-dashboard";
import CustomerOrders from "@/components/ecommerce/customer-orders";
import IntegratedDeliveryHub from "@/components/ecommerce/integrated-delivery-hub";
import DriverDashboard from "@/components/ecommerce/driver-dashboard";
import MerchantStoreManagement from "@/components/ecommerce/merchant-store-management";
import SendMoney from "@/components/services/send-money";
import PayScan from "@/components/services/pay-scan";
import BuyAirtime from "@/components/services/buy-airtime";
import PayBills from "@/components/services/pay-bills";
import Shop from "@/components/services/shop";
import Transport from "@/components/services/transport";
import SavingsChallenges from "@/components/savings/savings-challenges";
import PartnerWithAfriPay from "@/components/partnerships/partner-with-afripay";

export default function Services() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const serviceCategories = [
    {
      title: "Quick Services",
      services: [
        { id: "send-money", name: "Send Money", icon: Send, color: "bg-blue-100 text-blue-600", description: "Transfer funds to friends" },
        { id: "pay-scan", name: "Pay & Scan", icon: QrCode, color: "bg-green-100 text-green-600", description: "QR code payments" },
        { id: "buy-airtime", name: "Buy Airtime", icon: Phone, color: "bg-purple-100 text-purple-600", description: "Top up mobile credit" },
        { id: "pay-bills", name: "Pay Bills", icon: Zap, color: "bg-orange-100 text-orange-600", description: "Pay utilities & services" },
        { id: "shop", name: "Shop", icon: ShoppingBag, color: "bg-pink-100 text-pink-600", description: "African marketplace" },
        { id: "transport", name: "Transport", icon: Car, color: "bg-indigo-100 text-indigo-600", description: "Book rides & delivery" },
      ]
    },
    {
      title: "Transportation",
      services: [
        { id: "ride", name: "Ride Hailing", icon: Car, color: "bg-blue-100 text-blue-600", description: "Book rides instantly" },
        { id: "delivery", name: "Delivery", icon: MoreHorizontal, color: "bg-purple-100 text-purple-600", description: "Food & package delivery" },
      ]
    },
    {
      title: "Shopping & Delivery",
      services: [
        { id: "ecommerce", name: "AfriMart", icon: ShoppingBag, color: "bg-purple-100 text-purple-600", description: "Integrated shopping & delivery" },
        { id: "orders", name: "My Orders", icon: Package, color: "bg-orange-100 text-orange-600", description: "Track your orders" },
        { id: "merchant-store", name: "Store Management", icon: Building, color: "bg-emerald-100 text-emerald-600", description: "Manage your store" },
        { id: "driver", name: "Driver Hub", icon: Car, color: "bg-blue-100 text-blue-600", description: "Driver dashboard" },
        { id: "bills", name: "Bill Payments", icon: Zap, color: "bg-yellow-100 text-yellow-600", description: "Pay utility bills" },
      ]
    },
    {
      title: "Financial Services",
      services: [
        { id: "loans", name: "Micro Loans", icon: CreditCard, color: "bg-red-100 text-red-600", description: "Quick personal loans" },
        { id: "virtual-card", name: "Virtual Cards", icon: Building, color: "bg-emerald-100 text-emerald-600", description: "Secure online payments" },
        { id: "investment", name: "Investments", icon: Users, color: "bg-green-100 text-green-600", description: "Grow your wealth" },
        { id: "crypto", name: "Crypto Trading", icon: MoreHorizontal, color: "bg-orange-100 text-orange-600", description: "Trade cryptocurrencies" },
        { id: "trading", name: "Currency Trading", icon: Smartphone, color: "bg-indigo-100 text-indigo-600", description: "Multi-currency arbitrage" },
        { id: "admin", name: "Admin Portal", icon: MoreHorizontal, color: "bg-gray-100 text-gray-600", description: "System analytics" },
      ]
    }
  ];

  const handleServiceLaunch = (serviceId: string, serviceName: string) => {
    const availableServices = ['loans', 'virtual-card', 'crypto', 'investment', 'admin', 'trading', 'bills', 'shopping', 'ride', 'delivery', 'merchant', 'orders', 'ecommerce', 'driver', 'merchant-store'];
    if (availableServices.includes(serviceId)) {
      setSelectedService(serviceId);
    } else {
      toast({
        title: "Coming Soon",
        description: `${serviceName} service will be available soon`,
      });
    }
  };

  const renderServiceContent = () => {
    switch (selectedService) {
      case 'loans':
        return <LoanApplication />;
      case 'virtual-card':
        return <VirtualCardManager />;
      case 'crypto':
        return <CryptoTrading />;
      case 'investment':
        return <InvestmentProducts />;
      case 'admin':
        return <AdminDashboard />;
      case 'trading':
        return <MultiCurrencyTrading />;
      case 'bills':
        return <BillPayments />;
      case 'shopping':
        return <ShoppingMarketplace />;
      case 'ride':
        return <RideHailing />;
      case 'delivery':
        return <DeliveryService />;
      case 'merchant':
        return <MerchantDashboard />;
      case 'orders':
        return <CustomerOrders />;
      case 'ecommerce':
        return <IntegratedDeliveryHub />;
      case 'driver':
        return <DriverDashboard />;
      case 'merchant-store':
        return <MerchantStoreManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <main className="max-w-md mx-auto px-4 pb-20">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Services & Apps</h1>
          
          {/* Featured Services */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white mb-6">
            <h2 className="text-lg font-semibold mb-2">Mini-App Ecosystem</h2>
            <p className="text-white/80 text-sm mb-4">
              Discover integrated services and third-party apps in the AfriPay ecosystem
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 border-white/20"
              onClick={() => toast({ title: "Coming Soon", description: "Developer portal coming soon" })}
            >
              Developer Portal
            </Button>
          </div>

          {/* Service Categories */}
          <div className="space-y-6">
            {serviceCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">{category.title}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {category.services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <Button
                        key={service.id}
                        variant="ghost"
                        className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all h-auto text-center"
                        onClick={() => handleServiceLaunch(service.id, service.name)}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${service.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-neutral-900 text-sm mb-1">{service.name}</h4>
                        <p className="text-xs text-neutral-600">{service.description}</p>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Partner Integration */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Partner with AfriPay</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Integrate your service into our ecosystem and reach millions of African users
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSelectedService('partner-portal')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>
      
      <BottomNavigation currentPage="services" />
      
      {/* Service Modals */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedService === 'send-money' ? 'Send Money' :
               selectedService === 'pay-scan' ? 'Pay & Scan' :
               selectedService === 'buy-airtime' ? 'Buy Airtime' :
               selectedService === 'pay-bills' ? 'Pay Bills' :
               selectedService === 'shop' ? 'Shop' :
               selectedService === 'transport' ? 'Transport' :
               selectedService === 'savings-challenges' ? 'Savings Challenges' :
               selectedService === 'partner-portal' ? 'Partner with AfriPay' :
               selectedService === 'loans' ? 'Micro Loans' : 
               selectedService === 'virtual-card' ? 'Virtual Cards' :
               selectedService === 'crypto' ? 'Crypto Trading' :
               selectedService === 'investment' ? 'Investment Products' :
               selectedService === 'trading' ? 'Multi-Currency Trading' :
               selectedService === 'bills' ? 'Bill Payments' :
               selectedService === 'shopping' ? 'Shopping Marketplace' :
               selectedService === 'ride' ? 'Ride Hailing' :
               selectedService === 'delivery' ? 'Package Delivery' :
               selectedService === 'merchant' ? 'Merchant Dashboard' :
               selectedService === 'orders' ? 'My Orders' :
               selectedService === 'ecommerce' ? 'AfriMart - Shopping & Delivery' :
               selectedService === 'driver' ? 'Driver Dashboard' :
               selectedService === 'merchant-store' ? 'Store Management' :
               selectedService === 'admin' ? 'Admin Dashboard' : ''}
            </DialogTitle>
          </DialogHeader>
          {renderServiceContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
