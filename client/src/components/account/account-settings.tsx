import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Smartphone, 
  HelpCircle,
  Lock,
  Eye,
  EyeOff,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { t, setLanguage, getCurrentLanguage, getAvailableLanguages } from "@/lib/i18n";

interface AccountSettingsProps {
  onSectionChange: (section: string) => void;
}

export default function AccountSettings({ onSectionChange }: AccountSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProfile, setEditingProfile] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: preferences = [] } = useQuery({
    queryKey: ["/api/user/preferences"],
  });

  const { data: devices = [] } = useQuery({
    queryKey: ["/api/user/devices"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      await apiRequest("PUT", "/api/user/settings", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Settings Updated",
        description: "Your account settings have been saved",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const updatePreferenceMutation = useMutation({
    mutationFn: async ({ category, key, value }: { category: string; key: string; value: string }) => {
      await apiRequest("PUT", "/api/user/preferences", { category, key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences"] });
    },
  });

  const handleLanguageChange = (language: string) => {
    setLanguage(language as any);
    updatePreferenceMutation.mutate({
      category: "appearance",
      key: "language",
      value: language
    });
  };

  const handleNotificationToggle = (type: string, enabled: boolean) => {
    updatePreferenceMutation.mutate({
      category: "notifications",
      key: type,
      value: enabled.toString()
    });
  };

  const getPreferenceValue = (category: string, key: string, defaultValue: string = "") => {
    const pref = preferences.find((p: any) => p.category === category && p.key === key);
    return pref?.value || defaultValue;
  };

  const isNotificationEnabled = (type: string) => {
    return getPreferenceValue("notifications", type, "true") === "true";
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingProfile(!editingProfile)}
            >
              {editingProfile ? "Cancel" : "Edit"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-neutral-600">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="capitalize">{user?.currentRole}</Badge>
                <Badge 
                  className={`${
                    user?.kycStatus === 'verified' ? 'bg-success/10 text-success' : 
                    'bg-accent/10 text-accent'
                  }`}
                >
                  KYC: {user?.kycStatus}
                </Badge>
              </div>
            </div>
          </div>

          {editingProfile && (
            <div className="space-y-3 pt-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First Name"
                  defaultValue={user?.firstName || ""}
                />
                <Input
                  placeholder="Last Name"
                  defaultValue={user?.lastName || ""}
                />
              </div>
              <Input
                placeholder="Phone Number"
                defaultValue={user?.phoneNumber || ""}
              />
              <Input
                placeholder="Address"
                defaultValue={user?.address || ""}
              />
              <div className="flex space-x-2">
                <Button onClick={() => setEditingProfile(false)}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingProfile(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security & Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => onSectionChange("security")}
          >
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Security Settings</p>
                <p className="text-sm text-neutral-600">Password, 2FA, and security logs</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Separator />

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => onSectionChange("devices")}
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Manage Devices</p>
                <p className="text-sm text-neutral-600">{devices.length} active devices</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-neutral-600">Receive notifications on your device</p>
            </div>
            <Switch
              checked={isNotificationEnabled("push")}
              onCheckedChange={(checked) => handleNotificationToggle("push", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-neutral-600">Transaction and security updates</p>
            </div>
            <Switch
              checked={isNotificationEnabled("email")}
              onCheckedChange={(checked) => handleNotificationToggle("email", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-neutral-600">Critical security alerts</p>
            </div>
            <Switch
              checked={isNotificationEnabled("sms")}
              onCheckedChange={(checked) => handleNotificationToggle("sms", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Appearance & Language</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Language</label>
            <Select value={getCurrentLanguage()} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailableLanguages().map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Currency</label>
            <Select defaultValue="USD">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-neutral-600">Switch to dark theme</p>
            </div>
            <Switch
              checked={getPreferenceValue("appearance", "dark_mode") === "true"}
              onCheckedChange={(checked) => 
                updatePreferenceMutation.mutate({
                  category: "appearance",
                  key: "dark_mode",
                  value: checked.toString()
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Help & Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => onSectionChange("support")}
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Contact Support</p>
                <p className="text-sm text-neutral-600">Get help with your account</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}