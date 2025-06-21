import { useQuery } from "@tanstack/react-query";
import { User, Shield, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { UserProfile } from "@/types";

export default function Profile() {
  const { data: user } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

  const getKYCStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success/10 text-success';
      case 'in_progress':
        return 'bg-accent/10 text-accent';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'merchant':
        return 'Merchant';
      case 'agent':
        return 'Agent';
      default:
        return 'Consumer';
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Information",
      description: "Update your profile details",
      action: () => {},
    },
    {
      icon: Shield,
      label: "Security & Privacy",
      description: "Manage security settings",
      action: () => {},
    },
    {
      icon: Settings,
      label: "App Settings",
      description: "Notifications, language, theme",
      action: () => {},
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
      action: () => {},
    },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppHeader />
      
      <main className="max-w-md mx-auto px-4 pb-20">
        <div className="py-6">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.firstName?.[0] || user?.lastName?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-neutral-900">
                  {user?.firstName || user?.lastName 
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    : 'User'
                  }
                </h2>
                <p className="text-neutral-600">{user?.email || 'No email'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {getRoleDisplayName(user?.currentRole)}
                  </Badge>
                  <Badge className={`text-xs ${getKYCStatusColor(user?.kycStatus)}`}>
                    {user?.kycStatus === 'in_progress' ? 'KYC In Progress' : 
                     user?.kycStatus === 'verified' ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Verification Status */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-medium text-neutral-900 mb-3">Verification Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Phone</span>
                  <Badge className={user?.phoneVerified ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-600'}>
                    {user?.phoneVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Documents</span>
                  <Badge className={user?.documentsVerified ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-600'}>
                    {user?.documentsVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Biometric</span>
                  <Badge className={user?.biometricVerified ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-600'}>
                    {user?.biometricVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left rounded-none"
                    onClick={item.action}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{item.label}</p>
                        <p className="text-sm text-neutral-600">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </Button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>

          {/* Logout */}
          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full text-destructive border-destructive hover:bg-destructive hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </main>
      
      <BottomNavigation currentPage="profile" />
    </div>
  );
}
