import { useState } from "react";
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
import { UserProfile } from "@/types";
import { apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      <p className="text-gray-600 flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {getRoleDisplayName(user?.currentRole)}
                        </Badge>
                        <Badge className={`capitalize ${getKYCStatusColor(user?.kycStatus)}`}>
                          {user?.kycStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleEditProfile} variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{user?.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{user?.address || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{user?.dateOfBirth || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span>{user?.language || 'English'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span>{user?.currency || 'USD'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Switching */}
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Current Role</Label>
                    <p className="text-sm text-gray-600 mb-3">Switch between different user roles to access role-specific features</p>
                    <Select value={user?.currentRole} onValueChange={(role) => switchRoleMutation.mutate(role)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consumer">Consumer - Personal banking and payments</SelectItem>
                        <SelectItem value="merchant">Merchant - Business dashboard and analytics</SelectItem>
                        <SelectItem value="agent">Agent - Service provider tools and commissions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Phone</span>
                    </div>
                    <Badge variant={user?.phoneVerified ? "default" : "secondary"}>
                      {user?.phoneVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Documents</span>
                    </div>
                    <Badge variant={user?.documentsVerified ? "default" : "secondary"}>
                      {user?.documentsVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Biometric</span>
                    </div>
                    <Badge variant={user?.biometricVerified ? "default" : "secondary"}>
                      {user?.biometricVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={user?.twoFactorEnabled} />
                </div>
                
                <Separator />
                
                <div>
                  <Label>Password</Label>
                  <p className="text-sm text-gray-600 mb-3">Last changed: {user?.passwordChangedAt || 'Never'}</p>
                  <Button variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label>Account Recovery</Label>
                  <p className="text-sm text-gray-600 mb-3">Set up recovery options in case you lose access</p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Recovery Codes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registered Devices */}
            <Card>
              <CardHeader>
                <CardTitle>Registered Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userDevices?.map((device: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{device.deviceName || 'Unknown Device'}</p>
                          <p className="text-sm text-gray-600">Last seen: {device.lastSeen || 'Recently'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={device.isActive ? "default" : "secondary"}>
                          {device.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Device
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityLogs?.slice(0, 5).map((log: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{log.event || 'Security Event'}</p>
                        <p className="text-sm text-gray-600">{log.createdAt || 'Recently'}</p>
                      </div>
                      <Badge variant={log.severity === 'high' ? "destructive" : "secondary"}>
                        {log.severity || 'Low'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <Switch checked={user?.emailNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates via SMS</p>
                  </div>
                  <Switch checked={user?.smsNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications</p>
                  </div>
                  <Switch checked={user?.pushNotifications} />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <Select value={user?.language}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Currency</Label>
                  <Select value={user?.currency}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
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

                <div>
                  <Label>Timezone</Label>
                  <Select value={user?.timezone}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
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

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-600">Use dark theme</p>
                  </div>
                  <Switch checked={user?.darkMode} />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Account Data
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Deactivate Account
                </Button>
                
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            {/* Support Tickets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Support Tickets</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportTickets?.map((ticket: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">#{ticket.id} - {ticket.subject}</p>
                        <Badge variant={ticket.status === 'open' ? "default" : "secondary"}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                      <p className="text-xs text-gray-500">Created: {ticket.createdAt}</p>
                    </div>
                  ))}
                  
                  {(!supportTickets || supportTickets.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No support tickets found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ & Documentation
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Community Forum
                </Button>
              </CardContent>
            </Card>

            {/* App Info */}
            <Card>
              <CardHeader>
                <CardTitle>App Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-sm">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm">June 23, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Terms of Service</span>
                  <Button variant="link" size="sm" className="p-0 h-auto">View</Button>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Privacy Policy</span>
                  <Button variant="link" size="sm" className="p-0 h-auto">View</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input 
                    value={editForm.firstName} 
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input 
                    value={editForm.lastName} 
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input 
                  value={editForm.phoneNumber} 
                  onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input 
                  value={editForm.address} 
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input 
                  type="date"
                  value={editForm.dateOfBirth} 
                  onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <BottomNavigation />
    </div>
  );
}
