import { useState } from "react";
import { useLocation } from "wouter";
import { Car, ShoppingBag, Zap, Smartphone, CreditCard, Building, Users, MoreHorizontal, Package, Send, QrCode, Phone, Target, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePlatform } from "@/lib/platform-detection";
import { NativeServiceCard } from "@/components/ui/native-service-card";
import { NativeModal } from "@/components/ui/native-modal";
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
import EntertainmentHub from "@/components/entertainment/entertainment-hub";
import PlatformIndicator from "@/components/ui/platform-indicator";

export default function Services() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const platform = usePlatform();
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
      title: "Entertainment & Lifestyle",
      services: [
        { id: "entertainment", name: "Entertainment Hub", icon: Music, color: "bg-purple-100 text-purple-600", description: "Music, movies, games & events" },
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
    const availableServices = ['loans', 'virtual-card', 'crypto', 'investment', 'admin', 'trading', 'bills', 'shopping', 'ride', 'delivery', 'merchant', 'orders', 'ecommerce', 'driver', 'merchant-store', 'entertainment'];
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
      case 'entertainment':
        return <EntertainmentHub />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <AppHeader />

      <main className="container-content spacing-y-lg pb-24">
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Services & Apps</h1>

          {/* Featured Services */}
          <div className="brand-primary rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white elevation-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Mini-App Ecosystem</h2>
            <p className="text-sm sm:text-base opacity-90 mb-4 sm:mb-6 leading-relaxed">
              Discover integrated services and third-party apps in the AfriPay ecosystem
            </p>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 border-white/20 backdrop-blur-sm font-semibold min-h-[44px] touch-aaa focus-aaa w-full sm:w-auto"
              onClick={() => toast({ title: "Coming Soon", description: "Developer portal coming soon" })}
            >
              Developer Portal
            </Button>
          </div>

          {/* Service Categories */}
          <div className="space-y-6 sm:space-y-8">
            {serviceCategories.map((category) => (
              <div key={category.title} className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{category.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {category.services.map((service) => (
                    <NativeServiceCard
                      key={service.id}
                      id={service.id}
                      name={service.name}
                      description={service.description}
                      icon={service.icon}
                      color={service.color}
                      onClick={() => handleServiceLaunch(service.id, service.name)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Partner Integration */}
          <div className="card-refined bg-white dark:bg-neutral-800 p-4 sm:p-6 lg:p-8 shadow-elevated">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Partner with AfriPay</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Integrate your service into our ecosystem and reach millions of African users across the continent
            </p>
            <Button 
              variant="outline" 
              className="w-full btn-secondary-refined font-semibold min-h-[44px] py-3 touch-aaa"
              onClick={() => setLocation('/partnerships')}
            >
              Learn More About Partnerships
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="services" />
      
      <PlatformIndicator />

      {/* Service Modals */}
      <NativeModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={
          selectedService === 'send-money' ? 'Send Money' :
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
          selectedService === 'admin' ? 'Admin Dashboard' : 'Service'
        }
        size={platform.isMobile ? 'large' : 'medium'}
      >
        {renderServiceContent()}
      </NativeModal>
    </div>
  );
}