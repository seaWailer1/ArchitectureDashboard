import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Shield, Settings, HelpCircle, LogOut, ChevronRight, Edit2, Camera, Phone, Mail, MapPin, Calendar, CreditCard, Globe, Bell, Lock, Smartphone, Download, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserProfile } from "@/types";
import { apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { tm, language, isRTL } = useLanguage();

  const { data: user } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

  const { data: userDevices } = useQuery({
    queryKey: ["/api/user/devices"],
  });

  const { data: securityLogs } = useQuery({
    queryKey: ["/api/user/security-logs"],
  });

  const { data: supportTickets } = useQuery({
    queryKey: ["/api/user/support-tickets"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      return await apiRequest('PATCH', '/api/user/profile', updates);
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      return await apiRequest('POST', '/api/user/switch-role', { role });
    },
    onSuccess: () => {
      toast({ title: "Role switched successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: () => {
      toast({ title: "Failed to switch role", variant: "destructive" });
    },
  });

  const getKYCStatusColor = (status?: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
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

  const handleEditProfile = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm);
  };

  // Keyboard navigation for tabs
  const handleTabKeyDown = useCallback((event: React.KeyboardEvent, tabValue: string) => {
    const tabs = ['overview', 'security', 'settings', 'support'];
    const currentIndex = tabs.indexOf(activeTab);
    
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex]);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        setActiveTab(tabs[prevIndex]);
        break;
      case 'Home':
        event.preventDefault();
        setActiveTab(tabs[0]);
        break;
      case 'End':
        event.preventDefault();
        setActiveTab(tabs[tabs.length - 1]);
        break;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip links for accessibility */}
      <div className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50">
        <a 
          href="#main-content" 
          className="bg-primary text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        <a 
          href="#profile-tabs" 
          className="bg-primary text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
        >
          Skip to navigation
        </a>
      </div>
      
      <AppHeader />
      
      {/* Live region for screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
        id="profile-announcements"
      >
        {activeTab === 'overview' && 'Profile overview section loaded'}
        {activeTab === 'security' && 'Security settings section loaded'}
        {activeTab === 'settings' && 'App settings section loaded'}
        {activeTab === 'support' && 'Support section loaded'}
      </div>
      
      <main id="main-content" tabIndex={-1}>
        <h1 className="sr-only">Profile Management</h1>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 max-w-4xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList 
              id="profile-tabs"
              className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-white dark:bg-gray-800 border"
              role="tablist"
              aria-label="Profile navigation sections"
            >
            <TabsTrigger 
              value="overview" 
              className="text-xs sm:text-sm p-2 sm:p-3 min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
              role="tab"
              aria-selected={activeTab === 'overview'}
              aria-controls="overview-panel"
              id="overview-tab"
              tabIndex={activeTab === 'overview' ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 'overview')}
            >
              <User className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden sr-only">Profile Overview - View basic profile information and role management</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="text-xs sm:text-sm p-2 sm:p-3 min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
              role="tab"
              aria-selected={activeTab === 'security'}
              aria-controls="security-panel"
              id="security-tab"
              tabIndex={activeTab === 'security' ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 'security')}
            >
              <Shield className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden sr-only">Security Settings - Manage two-factor authentication, passwords, and devices</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="text-xs sm:text-sm p-2 sm:p-3 min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
              role="tab"
              aria-selected={activeTab === 'settings'}
              aria-controls="settings-panel"
              id="settings-tab"
              tabIndex={activeTab === 'settings' ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 'settings')}
            >
              <Settings className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden sr-only">App Settings - Configure notifications, language, and preferences</span>
            </TabsTrigger>
            <TabsTrigger 
              value="support" 
              className="text-xs sm:text-sm p-2 sm:p-3 min-h-[44px] data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
              role="tab"
              aria-selected={activeTab === 'support'}
              aria-controls="support-panel"
              id="support-tab"
              tabIndex={activeTab === 'support' ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, 'support')}
            >
              <HelpCircle className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Support</span>
              <span className="sm:hidden sr-only">Help & Support - Access support tickets and help resources</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent 
            value="overview" 
            className="space-y-4 sm:space-y-6"
            role="tabpanel"
            aria-labelledby="overview-tab"
            id="overview-panel"
            tabIndex={0}
          >
            {/* Profile Header */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className="relative shrink-0">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 rounded-full w-7 sm:w-8 h-7 sm:h-8 p-0 min-w-[44px] min-h-[44px]"
                      >
                        <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
                        <span className="sr-only">Change profile picture</span>
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-1 text-sm sm:text-base mt-1">
                        <Mail className="w-3 sm:w-4 h-3 sm:h-4 shrink-0" />
                        <span className="truncate">{user?.email}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="capitalize text-xs">
                          {getRoleDisplayName(user?.currentRole)}
                        </Badge>
                        <Badge className={`capitalize text-xs ${getKYCStatusColor(user?.kycStatus)}`}>
                          {user?.kycStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleEditProfile} 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto min-h-[44px] justify-center sm:justify-start"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{user?.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{user?.address || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{user?.dateOfBirth || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{user?.language || 'English'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 truncate">{user?.currency || 'USD'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Switching */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Role Management</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Current Role</Label>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                      Switch between different user roles to access role-specific features
                    </div>
                    <Select 
                      value={user?.currentRole} 
                      onValueChange={(role) => switchRoleMutation.mutate(role)}
                    >
                      <SelectTrigger 
                        className="h-12 text-sm"
                        aria-label="Current user role"
                        aria-describedby="role-description"
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consumer" className="py-3">
                          <div className="text-left">
                            <div className="font-medium">Consumer</div>
                            <div className="text-xs text-gray-500">Personal banking and payments</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="merchant" className="py-3">
                          <div className="text-left">
                            <div className="font-medium">Merchant</div>
                            <div className="text-xs text-gray-500">Business dashboard and analytics</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="agent" className="py-3">
                          <div className="text-left">
                            <div className="font-medium">Agent</div>
                            <div className="text-xs text-gray-500">Service provider tools and commissions</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div id="role-description" className="sr-only">
                      Switch between Consumer for personal banking, Merchant for business features, or Agent for service provider tools
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC Status */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 min-h-[60px]">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 shrink-0" />
                      <span className="font-medium text-sm sm:text-base">Phone</span>
                    </div>
                    <Badge variant={user?.phoneVerified ? "default" : "secondary"} className="text-xs">
                      {user?.phoneVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 min-h-[60px]">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 shrink-0" />
                      <span className="font-medium text-sm sm:text-base">Documents</span>
                    </div>
                    <Badge variant={user?.documentsVerified ? "default" : "secondary"} className="text-xs">
                      {user?.documentsVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 min-h-[60px] sm:col-span-1 col-span-full">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <User className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600 shrink-0" />
                      <span className="font-medium text-sm sm:text-base">Biometric</span>
                    </div>
                    <Badge variant={user?.biometricVerified ? "default" : "secondary"} className="text-xs">
                      {user?.biometricVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent 
            value="security" 
            className="space-y-4 sm:space-y-6"
            role="tabpanel"
            aria-labelledby="security-tab"
            id="security-panel"
            tabIndex={0}
          >
            {/* Security Settings */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex-1">
                    <Label className="text-sm sm:text-base font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={user?.twoFactorEnabled || false} 
                    className="shrink-0"
                    aria-label="Toggle two-factor authentication"
                    aria-describedby="2fa-description"
                    role="switch"
                  />
                  <div id="2fa-description" className="sr-only">
                    {user?.twoFactorEnabled ? 'Two-factor authentication is currently enabled' : 'Two-factor authentication is currently disabled'}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm sm:text-base font-medium">Password</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Last changed: {user?.passwordChangedAt || 'Never'}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm sm:text-base font-medium">Account Recovery</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Set up recovery options in case you lose access
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Recovery Codes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registered Devices */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Registered Devices</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {userDevices && Array.isArray(userDevices) && userDevices.length > 0 ? (
                    userDevices.map((device: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 min-h-[60px]">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Smartphone className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">
                              {device.deviceName || 'Unknown Device'}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                              Last seen: {device.lastSeen || 'Recently'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <Badge variant={device.isActive ? "default" : "secondary"} className="text-xs">
                            {device.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="min-w-[44px] min-h-[44px] p-2"
                            aria-label="Remove device"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No devices registered</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full min-h-[44px]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Device
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Logs */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Recent Security Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {securityLogs && Array.isArray(securityLogs) && securityLogs.length > 0 ? (
                    securityLogs.slice(0, 5).map((log: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800 min-h-[60px]">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {log.event || 'Security Event'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {log.createdAt || 'Recently'}
                          </p>
                        </div>
                        <Badge 
                          variant={log.severity === 'high' ? "destructive" : "secondary"} 
                          className="text-xs shrink-0"
                        >
                          {log.severity || 'Low'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No security activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent 
            value="settings" 
            className="space-y-4 sm:space-y-6"
            role="tabpanel"
            aria-labelledby="settings-tab"
            id="settings-panel"
            tabIndex={0}
          >
            {/* Notifications */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex-1">
                    <Label className="text-sm sm:text-base font-medium">Email Notifications</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch 
                    checked={user?.emailNotifications || false} 
                    className="shrink-0"
                    aria-label="Toggle email notifications"
                    aria-describedby="email-notif-desc"
                    role="switch"
                  />
                  <div id="email-notif-desc" className="sr-only">
                    Email notifications are {user?.emailNotifications ? 'enabled' : 'disabled'}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex-1">
                    <Label className="text-sm sm:text-base font-medium">SMS Notifications</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Receive updates via SMS
                    </p>
                  </div>
                  <Switch 
                    checked={user?.smsNotifications || false} 
                    className="shrink-0"
                    aria-label="Toggle SMS notifications"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex-1">
                    <Label className="text-sm sm:text-base font-medium">Push Notifications</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Receive push notifications
                    </p>
                  </div>
                  <Switch 
                    checked={user?.pushNotifications || false} 
                    className="shrink-0"
                    aria-label="Toggle push notifications"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">App Preferences</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-medium">Language</Label>
                  <Select value={user?.language || 'en'}>
                    <SelectTrigger className="h-12 text-sm">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                      <SelectItem value="sw">🇰🇪 Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-medium">Currency</Label>
                  <Select value={user?.currency || 'USD'}>
                    <SelectTrigger className="h-12 text-sm">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-medium">Timezone</Label>
                  <Select value={user?.timezone || 'UTC'}>
                    <SelectTrigger className="h-12 text-sm">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Africa/Lagos">West Africa Time</SelectItem>
                      <SelectItem value="Africa/Cairo">Central Africa Time</SelectItem>
                      <SelectItem value="Africa/Nairobi">East Africa Time</SelectItem>
                      <SelectItem value="Africa/Johannesburg">South Africa Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex-1">
                    <Label className="text-sm sm:text-base font-medium">{tm.language}</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {tm.selectLanguage}
                    </p>
                  </div>
                  <LanguageSelector variant="compact" className="shrink-0" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex-1">
                    <Label className="text-sm sm:text-base font-medium">Dark Mode</Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Use dark theme
                    </p>
                  </div>
                  <Switch 
                    checked={user?.darkMode || false} 
                    className="shrink-0"
                    aria-label="Toggle dark mode"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-3" />
                  Export Account Data
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Deactivate Account
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Account
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent 
            value="support" 
            className="space-y-4 sm:space-y-6"
            role="tabpanel"
            aria-labelledby="support-tab"
            id="support-panel"
            tabIndex={0}
          >
            {/* Support Tickets */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg sm:text-xl">Support Tickets</CardTitle>
                  <Button className="w-full sm:w-auto min-h-[44px]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {supportTickets && Array.isArray(supportTickets) && supportTickets.length > 0 ? (
                    supportTickets.map((ticket: any, index: number) => (
                      <div key={index} className="p-3 sm:p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <p className="font-medium text-sm sm:text-base truncate">
                            #{ticket.id} - {ticket.subject}
                          </p>
                          <Badge 
                            variant={ticket.status === 'open' ? "default" : "secondary"} 
                            className="text-xs self-start sm:self-center shrink-0"
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {ticket.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Created: {ticket.createdAt}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No support tickets found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help Resources */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Help & Resources</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                >
                  <HelpCircle className="w-4 h-4 mr-3" />
                  FAQ & Documentation
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 mr-3" />
                  Contact Support
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                >
                  <Mail className="w-4 h-4 mr-3" />
                  Email Support
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start min-h-[44px] text-sm sm:text-base"
                >
                  <Globe className="w-4 h-4 mr-3" />
                  Community Forum
                </Button>
              </CardContent>
            </Card>

            {/* App Info */}
            <Card className="border-0 sm:border shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">App Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Version</span>
                  <span className="text-sm sm:text-base font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-sm sm:text-base font-medium">June 23, 2025</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Terms of Service</span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-sm sm:text-base min-h-[44px] min-w-[44px]"
                  >
                    View
                  </Button>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Privacy Policy</span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-sm sm:text-base min-h-[44px] min-w-[44px]"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-lg sm:text-xl">Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">First Name</Label>
                  <Input 
                    value={(editForm as any)?.firstName || ''} 
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="h-12 text-sm"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Name</Label>
                  <Input 
                    value={(editForm as any)?.lastName || ''} 
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="h-12 text-sm"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input 
                  value={(editForm as any)?.phoneNumber || ''} 
                  onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                  className="h-12 text-sm"
                  placeholder="Enter phone number"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Address</Label>
                <Input 
                  value={(editForm as any)?.address || ''} 
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="h-12 text-sm"
                  placeholder="Enter address"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date of Birth</Label>
                <Input 
                  type="date"
                  value={(editForm as any)?.dateOfBirth || ''} 
                  onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                  className="h-12 text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={updateProfileMutation.isPending}
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
