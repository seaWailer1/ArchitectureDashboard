import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUsers, FaUserCheck, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShieldAlt, FaCreditCard, FaUser, FaRedo, FaSignInAlt, FaPlus, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaGlobe, FaArrowRight, FaMobile, FaPlay } from "react-icons/fa";
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
        return <FaCreditCard className="w-4 h-4" />;
      case 'agent':
        return <FaShieldAlt className="w-4 h-4" />;
      default:
        return <FaUser className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <FaClock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <FaExclamationCircle className="w-4 h-4 text-orange-600" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-400" />;
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
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaGlobe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AfriPay Demo</h1>
          <p className="text-xl text-white/90 mb-2">Test User Journeys</p>
          <p className="text-white/80 max-w-2xl mx-auto">
            Select a test user to experience different onboarding and KYC scenarios.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <FaShieldAlt className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Secure KYC</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <FaMobile className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Mobile First</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <FaCreditCard className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Multi-Wallet</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center text-white">
            <FaUsers className="w-6 h-6 mx-auto mb-2" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {presetUsers?.map((user: PresetUser) => (
                  <Card key={user.id} className="hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <p className="text-sm text-neutral-600">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getRoleVariant(user.role)} className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </Badge>
                        <Badge variant={getStatusVariant(user.status)} className="flex items-center space-x-1">
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-neutral-700">{user.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Button 
                        onClick={() => simulateOnboardingMutation.mutate(user)}
                        disabled={simulateOnboardingMutation.isPending}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        {simulateOnboardingMutation.isPending ? (
                          <FaRedo className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaPlay className="w-4 h-4" />
                        )}
                        <span>Start Journey</span>
                        <FaArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Users State */}
              {(!presetUsers || presetUsers.length === 0) && (
                <Card className="text-center py-16 bg-white/98 backdrop-blur-lg border border-white/20 rounded-3xl">
                  <CardContent>
                    <div className="w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FaUsers className="w-12 h-12 text-neutral-500" />
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
                        <FaRedo className="w-5 h-5 animate-spin" />
                      ) : (
                        <FaPlus className="w-5 h-5" />
                      )}
                      <span>Create Test Users</span>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FaShieldAlt className="w-5 h-5" />
                    <span>Quick Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Roles</h4>
                      <p className="text-neutral-600">Consumer, Merchant, Agent - each with different features</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Status</h4>
                      <p className="text-neutral-600">Pending (onboarding), In Progress (KYC), Verified (full access)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Auto-Fill</h4>
                      <p className="text-neutral-600">Forms will be pre-filled with user data for testing</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation("/signin")}
                      className="flex items-center space-x-2 mx-auto"
                    >
                      <FaSignInAlt className="w-4 h-4" />
                      <span>Regular Sign In</span>
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