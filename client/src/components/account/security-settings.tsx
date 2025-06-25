import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Key, Clock, AlertTriangle, CheckCircle, Eye, EyeOff, ArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SecuritySettingsProps {
  onBack: () => void;
}

export default function SecuritySettings({ onBack }: SecuritySettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: securityLogs = [] } = useQuery({
    queryKey: ["/api/security/logs"],
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      await apiRequest("PUT", "/api/auth/change-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
      setShowPasswordForm(false);
    },
    onError: () => {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  const toggle2FAMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      await apiRequest("PUT", "/api/auth/2fa/toggle", { enabled });
    },
    onSuccess: (_, enabled) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: enabled ? "2FA Enabled" : "2FA Disabled",
        description: enabled 
          ? "Two-factor authentication has been enabled for your account"
          : "Two-factor authentication has been disabled",
      });
    },
  });

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "blocked":
        return <Shield className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Security Settings</h2>
          <p className="text-neutral-600">Manage your account security</p>
        </div>
      </div>

      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Password Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-neutral-600">
                Last changed: {user?.passwordChangedAt || "Never"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? "Cancel" : "Change"}
            </Button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-1 block">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4 text-neutral-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-neutral-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 text-neutral-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-neutral-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full"
              >
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-neutral-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={user?.twoFactorEnabled || false}
              onCheckedChange={(checked) => toggle2FAMutation.mutate(checked)}
              disabled={toggle2FAMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Security Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {securityLogs.length === 0 ? (
            <p className="text-center text-neutral-600 py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {securityLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <p className="font-medium capitalize">{log.action.replace("_", " ")}</p>
                      <p className="text-sm text-neutral-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                      {log.ipAddress && (
                        <p className="text-xs text-neutral-500">IP: {log.ipAddress}</p>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={
                      log.status === "success"
                        ? "bg-success/10 text-success"
                        : log.status === "failed"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                    }
                  >
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="font-medium">Account Active</p>
              <p className="text-sm text-neutral-600">Your account is in good standing</p>
            </div>
            
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <Shield className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="font-medium">Security Score</p>
              <p className="text-lg font-bold text-neutral-900">
                {user?.twoFactorEnabled ? "85%" : "65%"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}