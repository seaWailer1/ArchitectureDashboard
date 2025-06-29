import React from 'react';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
import { usePlatform } from '@/lib/platform-detection';
import { Badge } from '@/components/ui/badge';

export const PlatformIndicator: React.FC = () => {
  const platform = usePlatform();

  const getPlatformInfo = () => {
    switch (platform.platform) {
      case 'ios':
        return {
          icon: Smartphone,
          label: 'iOS Experience',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          description: 'Optimized for iOS with native-like interactions'
        };
      
      case 'android':
        return {
          icon: Smartphone,
          label: 'Android Experience',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          description: 'Material Design interactions and animations'
        };
      
      case 'huawei':
        return {
          icon: Smartphone,
          label: 'HarmonyOS Experience',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          description: 'HarmonyOS design language and interactions'
        };
      
      default:
        return {
          icon: platform.isTablet ? Tablet : platform.isDesktop ? Monitor : Smartphone,
          label: platform.isTablet ? 'Tablet Experience' : platform.isDesktop ? 'Desktop Experience' : 'Web Experience',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          description: 'Web-optimized interface and interactions'
        };
    }
  };

  const platformInfo = getPlatformInfo();
  const Icon = platformInfo.icon;

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 left-4 z-[100] max-w-xs">
      <Badge 
        className={`${platformInfo.color} flex items-center gap-2 text-xs font-medium px-3 py-2 shadow-lg backdrop-blur-sm`}
      >
        <Icon className="w-3 h-3" />
        <span>{platformInfo.label}</span>
      </Badge>
      
      {/* Expanded info on hover/focus */}
      <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 pointer-events-none transition-opacity duration-200 hover:opacity-100 focus-within:opacity-100">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
              {platformInfo.label}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {platformInfo.description}
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <div>Touch: {platform.supportsTouchGestures ? 'Yes' : 'No'}</div>
              <div>Haptics: {platform.supportsHaptics ? 'Yes' : 'No'}</div>
              <div>Native: {platform.isNative ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformIndicator;