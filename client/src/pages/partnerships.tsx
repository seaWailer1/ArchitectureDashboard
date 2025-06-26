import { useLocation } from "wouter";
import PartnerWithAfriPay from "@/components/partnerships/partner-with-afripay";

export default function PartnershipsPage() {
  const [, setLocation] = useLocation();
  
  const handleBack = () => {
    setLocation('/services');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <PartnerWithAfriPay onBack={handleBack} />
    </div>
  );
}