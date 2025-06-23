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
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
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
      return await apiRequest('POST', '/api/preset-users/create');
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
      try {
        // First switch to the user
        const response = await apiRequest('POST', `/api/preset-users/switch/${userData.id}`);
        
        console.log('User switch response:', response);
        
        // Return user data for auto-fill
        return userData;
      } catch (error) {
        console.error('Error switching user:', error);
        throw error;
      }
    },
    onSuccess: (userData) => {
      console.log('User switching successful:', userData);
      
      // Store user data in sessionStorage for auto-fill
      const autoFillData = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phoneNumber: userData.phoneNumber || `+234 123 456 7890`,
        address: userData.address || `123 Main Street`,
        city: userData.city || `Lagos`,
        country: userData.country || `NG`,
      };
      
      sessionStorage.setItem('testUserData', JSON.stringify(autoFillData));
      
      toast({
        title: "Starting Journey",
        description: `Switching to ${userData.name}`,
      });
      
      // Clear cache and force a page reload
      queryClient.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to load onboarding simulation. Please try again.",
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
        <div className="text-center text-white mb-16">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-lg border border-white/20 shadow-2xl">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white/50 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            AfriPay Demo Experience
          </h1>
          <p className="text-2xl text-white/95 mb-4 font-medium">Test the Complete User Journey</p>
          <p className="text-white/80 max-w-3xl mx-auto text-lg leading-relaxed">
            Select a test user profile to experience the onboarding and KYC journey. 
            Each user has different scenarios to demonstrate various features and flows across Africa's financial ecosystem.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="group bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-2xl p-6 text-center text-white border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <p className="font-semibold">Secure KYC</p>
            <p className="text-xs text-white/70 mt-1">Bank-grade security</p>
          </div>
          <div className="group bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-2xl p-6 text-center text-white border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <p className="font-semibold">Mobile First</p>
            <p className="text-xs text-white/70 mt-1">Optimized experience</p>
          </div>
          <div className="group bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-2xl p-6 text-center text-white border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <p className="font-semibold">Multi-Wallet</p>
            <p className="text-xs text-white/70 mt-1">Crypto & fiat support</p>
          </div>
          <div className="group bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-2xl p-6 text-center text-white border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <p className="font-semibold">Multi-Role</p>
            <p className="text-xs text-white/70 mt-1">Consumer, merchant, agent</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {presetUsers?.map((user: PresetUser) => (
                  <Card key={user.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/98 backdrop-blur-lg border border-white/20 rounded-3xl">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardHeader className="relative pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center">
                              {getStatusIcon(user.status)}
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-neutral-900">{user.name}</CardTitle>
                            <p className="text-sm text-neutral-600 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge variant={getRoleVariant(user.role)} className="flex items-center space-x-2 px-3 py-1 rounded-full font-semibold">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </Badge>
                        <Badge variant={getStatusVariant(user.status)} className="flex items-center space-x-2 px-3 py-1 rounded-full font-semibold">
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-neutral-700 leading-relaxed">{user.description}</p>
                    </CardHeader>
                    
                    <CardContent className="relative pt-0">
                      <div className="space-y-4">
                        {/* User Details */}
                        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100/50 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-neutral-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Phone className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{user.phoneNumber || '+234 123 456 7890'}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-neutral-700">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-medium">{user.city || 'Lagos'}, {user.country || 'Nigeria'}</span>
                          </div>
                        </div>
                        
                        {/* Journey Preview */}
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
                          <h4 className="font-bold text-sm mb-2 text-primary">Journey Preview</h4>
                          <p className="text-sm text-neutral-700 leading-relaxed">{getJourneyDescription(user.status)}</p>
                        </div>
                        
                        {/* Action Button */}
                        <Button 
                          onClick={() => simulateOnboardingMutation.mutate(user)}
                          disabled={simulateOnboardingMutation.isPending}
                          className="w-full h-12 flex items-center justify-center space-x-3 bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                        >
                          {simulateOnboardingMutation.isPending ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                          <span>Start Journey</span>
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Users State */}
              {(!presetUsers || presetUsers.length === 0) && (
                <Card className="text-center py-16 bg-white/98 backdrop-blur-lg border border-white/20 rounded-3xl">
                  <CardContent>
                    <div className="w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-12 h-12 text-neutral-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Test Users Available</h3>
                    <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                      Create preset user accounts to begin testing the onboarding journey with realistic personas.
                    </p>
                    <Button 
                      onClick={() => createUsersMutation.mutate()}
                      disabled={createUsersMutation.isPending}
                      className="flex items-center space-x-3 mx-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      {createUsersMutation.isPending ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      <span>Create Test Users</span>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              <Card className="bg-white/98 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Demo Instructions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-lg text-primary">User Roles</h4>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                          <User className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-blue-900">Consumer</span>
                            <p className="text-sm text-blue-700">Personal banking and payments</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                          <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-green-900">Merchant</span>
                            <p className="text-sm text-green-700">Business dashboard and analytics</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl">
                          <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-purple-900">Agent</span>
                            <p className="text-sm text-purple-700">Service provider tools and commissions</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <h4 className="font-bold text-lg text-primary">Journey Stages</h4>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3 p-3 bg-orange-50 rounded-xl">
                          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-orange-900">Pending</span>
                            <p className="text-sm text-orange-700">Complete onboarding flow</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-xl">
                          <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-yellow-900">In Progress</span>
                            <p className="text-sm text-yellow-700">Finish KYC verification</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-green-900">Verified</span>
                            <p className="text-sm text-green-700">Access full application</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h4 className="font-bold text-lg text-primary">Auto-Fill Features</h4>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                          <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-blue-900">Personal Info</span>
                            <p className="text-sm text-blue-700">Name, email, and basic details</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                          <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-green-900">Contact Details</span>
                            <p className="text-sm text-green-700">Phone and communication preferences</p>
                          </div>
                        </li>
                        <li className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl">
                          <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <span className="font-semibold text-red-900">Location</span>
                            <p className="text-sm text-red-700">Address and regional settings</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  <div className="text-center bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-6">
                    <p className="text-neutral-700 mb-4 font-medium">
                      Want to use the regular authentication flow instead?
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation("/signin")}
                      className="flex items-center space-x-2 mx-auto border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 rounded-xl px-6 py-2"
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