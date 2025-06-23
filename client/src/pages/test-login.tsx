import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  UserCheck, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Shield,
  CreditCard,
  User,
  RefreshCw,
  LogIn,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Globe,
  ArrowRight,
  Smartphone,
  Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface PresetUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  description: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
}

export default function TestLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: presetUsers, isLoading } = useQuery({
    queryKey: ["/api/preset-users"],
  });

  const createUsersMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/preset-users/create', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: "Test Users Created",
        description: "Preset users are now available for testing.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/preset-users"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create preset users.",
        variant: "destructive",
      });
    },
  });

  const simulateOnboardingMutation = useMutation({
    mutationFn: async (userData: PresetUser) => {
      // First switch to the user
      await apiRequest(`/api/preset-users/switch/${userData.id}`, {
        method: 'POST',
      });
      
      // Return user data for auto-fill
      return userData;
    },
    onSuccess: (userData) => {
      toast({
        title: "Starting Onboarding Journey",
        description: `Beginning simulation with ${userData.name}`,
      });
      
      // Store user data in sessionStorage for auto-fill
      sessionStorage.setItem('testUserData', JSON.stringify(userData));
      
      // Clear cache and navigate to onboarding
      queryClient.clear();
      
      // Navigate based on user status
      if (userData.status === 'verified') {
        setLocation("/");
      } else if (userData.status === 'in_progress') {
        setLocation("/kyc");
      } else {
        setLocation("/onboarding");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start onboarding simulation.",
        variant: "destructive",
      });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'merchant':
        return <CreditCard className="w-4 h-4" />;
      case 'agent':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRoleVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'merchant':
        return 'secondary';
      case 'agent':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getJourneyDescription = (status: string) => {
    switch (status) {
      case 'verified':
        return "Experience the full app with all features unlocked";
      case 'in_progress':
        return "Complete the remaining KYC verification steps";
      case 'pending':
        return "Go through the complete onboarding and KYC journey";
      default:
        return "Start from the beginning";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AfriPay Demo Experience</h1>
          <p className="text-xl text-white/90 mb-2">Test the Complete User Journey</p>
          <p className="text-white/70 max-w-2xl mx-auto">
            Select a test user profile to experience the onboarding and KYC journey. 
            Each user has different scenarios to demonstrate various features and flows.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <Shield className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Secure KYC</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <Smartphone className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Mobile First</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Multi-Wallet</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Multi-Role</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* User Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {presetUsers?.map((user: PresetUser) => (
                  <Card key={user.id} className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/95 backdrop-blur-sm border-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <p className="text-sm text-neutral-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={getRoleVariant(user.role)} className="flex items-center space-x-1 text-xs">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </Badge>
                          <Badge variant={getStatusVariant(user.status)} className="flex items-center space-x-1 text-xs">
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-neutral-700 leading-relaxed">{user.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* User Details */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-xs text-neutral-600">
                            <Phone className="w-3 h-3" />
                            <span>{user.phoneNumber}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-neutral-600">
                            <MapPin className="w-3 h-3" />
                            <span>{user.city}, {user.country}</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Journey Preview */}
                        <div className="bg-neutral-50 rounded-lg p-3">
                          <h4 className="font-medium text-sm mb-1">Journey Preview</h4>
                          <p className="text-xs text-neutral-600">{getJourneyDescription(user.status)}</p>
                        </div>
                        
                        {/* Action Button */}
                        <Button 
                          onClick={() => simulateOnboardingMutation.mutate(user)}
                          disabled={simulateOnboardingMutation.isPending}
                          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        >
                          {simulateOnboardingMutation.isPending ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span>Start Journey</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Users State */}
              {(!presetUsers || presetUsers.length === 0) && (
                <Card className="text-center py-12 bg-white/95 backdrop-blur-sm border-0">
                  <CardContent>
                    <Users className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Test Users Available</h3>
                    <p className="text-neutral-600 mb-6">
                      Create preset user accounts to begin testing the onboarding journey.
                    </p>
                    <Button 
                      onClick={() => createUsersMutation.mutate()}
                      disabled={createUsersMutation.isPending}
                      className="flex items-center space-x-2 mx-auto bg-gradient-to-r from-primary to-secondary"
                    >
                      {createUsersMutation.isPending ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>Create Test Users</span>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              <Card className="bg-white/95 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <Shield className="w-6 h-6" />
                    <span>Demo Instructions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">User Roles</h4>
                      <ul className="space-y-2 text-sm text-neutral-700">
                        <li className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span><strong>Consumer:</strong> Personal banking and payments</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-green-600" />
                          <span><strong>Merchant:</strong> Business dashboard and analytics</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span><strong>Agent:</strong> Service provider tools and commissions</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Journey Stages</h4>
                      <ul className="space-y-2 text-sm text-neutral-700">
                        <li className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span><strong>Pending:</strong> Complete onboarding flow</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span><strong>In Progress:</strong> Finish KYC verification</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Verified:</strong> Access full application</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Auto-Fill Features</h4>
                      <ul className="space-y-2 text-sm text-neutral-700">
                        <li className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>Personal information pre-filled</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span>Contact details populated</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span>Address information included</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="text-center">
                    <p className="text-sm text-neutral-600 mb-4">
                      Want to use the regular authentication flow instead?
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation("/signin")}
                      className="flex items-center space-x-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Go to Sign In</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}