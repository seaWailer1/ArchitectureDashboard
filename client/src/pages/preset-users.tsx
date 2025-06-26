import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  UserCheck, 
  UserX, 
  FaClock, 
  FaMapMarkerAlt,
  FaPhone,
  Mail,
  Shield,
  FaCreditCard,
  FaUser,
  RefreshCw,
  LogIn,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
  XCircle
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AppHeader from "@/components/layout/app-header";
import { useLocation } from "wouter";

interface PresetUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  description: string;
}

export default function PresetUsers() {
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
        title: "Success",
        description: "Preset users have been created successfully.",
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

  const switchUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest(`/api/preset-users/switch/${userId}`, {
        method: 'POST',
      });
    },
    onSuccess: (data, userId) => {
      toast({
        title: "FaUser Switched",
        description: `Successfully switched to user ${userId}`,
      });
      // Clear all cached data and refresh
      queryClient.clear();
      // Force page reload to ensure clean state
      window.location.href = "/";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to switch user. This feature is only available in development mode.",
        variant: "destructive",
      });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'merchant':
        return <FaCreditCard className="w-4 h-4" />;
      case 'agent':
        return <Shield className="w-4 h-4" />;
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
        return <XCircle className="w-4 h-4 text-red-600" />;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader />
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Preset Test Users</h1>
              <p className="text-neutral-600">
                Pre-configured user accounts for testing different roles and scenarios
              </p>
            </div>
            <Button 
              onClick={() => createUsersMutation.mutate()}
              disabled={createUsersMutation.isPending}
              className="flex items-center space-x-2"
            >
              {createUsersMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FaPlus className="w-4 h-4" />
              )}
              <span>Create Users</span>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Users</p>
                  <p className="text-xl font-bold">{presetUsers?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Verified</p>
                  <p className="text-xl font-bold">
                    {presetUsers?.filter((u: PresetUser) => u.status === 'verified').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FaClock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Pending KYC</p>
                  <p className="text-xl font-bold">
                    {presetUsers?.filter((u: PresetUser) => u.status !== 'verified').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Merchants/Agents</p>
                  <p className="text-xl font-bold">
                    {presetUsers?.filter((u: PresetUser) => u.role !== 'consumer').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FaUser List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {presetUsers?.map((user: PresetUser) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <p className="text-sm text-neutral-600">{user.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getRoleVariant(user.role)} className="flex items-center space-x-1">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </Badge>
                    <Badge variant={getStatusVariant(user.status)} className="flex items-center space-x-1">
                      {getStatusIcon(user.status)}
                      <span className="capitalize">{user.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  <p className="text-sm text-neutral-700">{user.description}</p>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">
                      Click to test as this user
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => switchUserMutation.mutate(user.id)}
                      disabled={switchUserMutation.isPending}
                      className="flex items-center space-x-2"
                    >
                      {switchUserMutation.isPending ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogIn className="w-4 h-4" />
                      )}
                      <span>Switch FaUser</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!presetUsers || presetUsers.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Preset Users Found</h3>
              <p className="text-neutral-600 mb-6">
                Create preset user accounts to test different roles and scenarios.
              </p>
              <Button 
                onClick={() => createUsersMutation.mutate()}
                disabled={createUsersMutation.isPending}
                className="flex items-center space-x-2 mx-auto"
              >
                {createUsersMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FaPlus className="w-4 h-4" />
                )}
                <span>Create Preset Users</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Usage Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">FaUser Types</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-center space-x-2">
                    <FaUser className="w-4 h-4 text-blue-600" />
                    <span><strong>Consumer:</strong> Personal banking and payments</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaCreditCard className="w-4 h-4 text-green-600" />
                    <span><strong>Merchant:</strong> Business dashboard and payment processing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span><strong>Agent:</strong> Commission tracking and service provider tools</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">KYC Status Types</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-center space-x-2">
                    <FaCheckCircle className="w-4 h-4 text-green-600" />
                    <span><strong>Verified:</strong> Full access to all features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaClock className="w-4 h-4 text-yellow-600" />
                    <span><strong>In Progress:</strong> Partial verification completed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaExclamationCircle className="w-4 h-4 text-orange-600" />
                    <span><strong>Pending:</strong> Requires onboarding/KYC completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}