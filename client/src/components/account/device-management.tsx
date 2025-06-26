import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Shield, 
  ShieldCheck, 
  FaTimes,
  FaArrowLeft,
  Clock,
  FaMapMarkerAlt 
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  os: string;
  browser: string;
  isActive: boolean;
  isTrusted: boolean;
  lastUsedAt: string;
  firstUsedAt: string;
}

interface DeviceManagementProps {
  onBack: () => void;
}

export default function DeviceManagement({ onBack }: DeviceManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["/api/user/devices"],
  });

  const updateDeviceMutation = useMutation({
    mutationFn: async ({ deviceId, action }: { deviceId: string; action: 'deactivate' | 'trust' | 'remove' }) => {
      await apiRequest("PUT", `/api/user/devices/${deviceId}/${action}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/devices"] });
      toast({
        title: "Device Updated",
        description: "Device status has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update device",
        variant: "destructive",
      });
    },
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case 'mobile':
        return 'bg-blue-100 text-blue-700';
      case 'tablet':
        return 'bg-purple-100 text-purple-700';
      case 'desktop':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDeviceAction = (deviceId: string, action: 'deactivate' | 'trust' | 'remove') => {
    updateDeviceMutation.mutate({ deviceId, action });
  };

  const currentDevice = devices.find(d => d.deviceId === 'current-device') || devices[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <FaArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Device Management</h2>
          <p className="text-neutral-600">Manage your connected devices</p>
        </div>
      </div>

      {/* Current Device */}
      {currentDevice && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getDeviceIcon(currentDevice.deviceType)}
                <span>Current Device</span>
              </div>
              <Badge className="bg-success/10 text-success">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Device Name</span>
                <span className="font-medium">{currentDevice.deviceName || 'Unknown Device'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Operating System</span>
                <span className="font-medium">{currentDevice.os || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Browser</span>
                <span className="font-medium">{currentDevice.browser || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Last Used</span>
                <span className="font-medium">Now</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Trust Status</span>
                <div className="flex items-center space-x-2">
                  {currentDevice.isTrusted ? (
                    <ShieldCheck className="w-4 h-4 text-success" />
                  ) : (
                    <Shield className="w-4 h-4 text-accent" />
                  )}
                  <span className="text-sm font-medium">
                    {currentDevice.isTrusted ? 'Trusted' : 'Untrusted'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Devices */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Other Devices ({devices.length - 1})</h3>
        
        {devices.filter(d => d.deviceId !== currentDevice?.deviceId).length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Monitor className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">No other devices found</p>
              <p className="text-sm text-neutral-500 mt-1">
                You'll see devices here when you sign in from other locations
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {devices
              .filter(d => d.deviceId !== currentDevice?.deviceId)
              .map((device) => (
                <Card key={device.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDeviceTypeColor(device.deviceType)}`}>
                          {getDeviceIcon(device.deviceType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{device.deviceName || 'Unknown Device'}</h4>
                            {device.isTrusted && (
                              <ShieldCheck className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-neutral-600">
                            <div className="flex items-center space-x-1">
                              <span>{device.os}</span>
                              <span>•</span>
                              <span>{device.browser}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Last used: {new Date(device.lastUsedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaMapMarkerAlt className="w-3 h-3" />
                              <span>First seen: {new Date(device.firstUsedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Badge 
                          className={device.isActive ? "bg-success/10 text-success" : "bg-neutral-100 text-neutral-600"}
                        >
                          {device.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        
                        <div className="flex space-x-1">
                          {!device.isTrusted && device.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeviceAction(device.deviceId, 'trust')}
                              disabled={updateDeviceMutation.isPending}
                            >
                              Trust
                            </Button>
                          )}
                          
                          {device.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeviceAction(device.deviceId, 'deactivate')}
                              disabled={updateDeviceMutation.isPending}
                            >
                              Sign Out
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeviceAction(device.deviceId, 'remove')}
                            disabled={updateDeviceMutation.isPending}
                          >
                            <FaTimes className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Sign out from devices you don't recognize or no longer use</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Trust devices only when you're sure they're secure and belong to you</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Check this page regularly to monitor your account security</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}