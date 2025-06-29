export type Platform = 'ios' | 'android' | 'huawei' | 'web' | 'desktop';

export interface PlatformInfo {
  platform: Platform;
  isNative: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsTouchGestures: boolean;
  supportsHaptics: boolean;
  preferredInteraction: 'tap' | 'click' | 'touch';
  animationStyle: 'ios' | 'material' | 'harmonyos' | 'web';
}

export const detectPlatform = (): PlatformInfo => {
  if (typeof window === 'undefined') {
    return {
      platform: 'web',
      isNative: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      supportsTouchGestures: false,
      supportsHaptics: false,
      preferredInteraction: 'click',
      animationStyle: 'web'
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isStandalone = (window.navigator as any).standalone === true || 
                      window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for specific platforms
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  const isHuawei = /huawei|honor|hihonor/.test(userAgent) || 
                   /harmonyos/.test(userAgent);
  
  // Check device types
  const isMobile = /mobi|android|iphone/.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)/.test(userAgent) || 
                   (navigator.maxTouchPoints > 1 && !isMobile);
  const isDesktop = !isMobile && !isTablet;
  
  // Determine platform
  let platform: Platform = 'web';
  if (isIOS) platform = 'ios';
  else if (isHuawei) platform = 'huawei';
  else if (isAndroid) platform = 'android';
  else if (isDesktop) platform = 'desktop';

  // Check for native features
  const supportsTouchGestures = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const supportsHaptics = 'vibrate' in navigator || 'hapticFeedback' in (window as any);

  return {
    platform,
    isNative: isStandalone,
    isMobile,
    isTablet,
    isDesktop,
    supportsTouchGestures,
    supportsHaptics,
    preferredInteraction: supportsTouchGestures ? 'tap' : 'click',
    animationStyle: platform === 'ios' ? 'ios' : 
                   platform === 'huawei' ? 'harmonyos' : 
                   platform === 'android' ? 'material' : 'web'
  };
};

export const getInteractionStyles = (platformInfo: PlatformInfo) => {
  const baseStyles = "transition-all duration-200 active:scale-95";
  
  switch (platformInfo.platform) {
    case 'ios':
      return `${baseStyles} active:bg-gray-100 dark:active:bg-gray-800 rounded-xl`;
    
    case 'android':
      return `${baseStyles} active:bg-gray-200 dark:active:bg-gray-700 rounded-lg shadow-sm active:shadow-md`;
    
    case 'huawei':
      return `${baseStyles} active:bg-gradient-to-r active:from-blue-50 active:to-purple-50 dark:active:from-blue-900 dark:active:to-purple-900 rounded-2xl`;
    
    default:
      return `${baseStyles} hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`;
  }
};

export const getAnimationPreset = (platformInfo: PlatformInfo) => {
  switch (platformInfo.animationStyle) {
    case 'ios':
      return {
        duration: 'duration-300',
        easing: 'ease-out',
        scale: 'active:scale-95',
        opacity: 'active:opacity-80'
      };
    
    case 'material':
      return {
        duration: 'duration-200',
        easing: 'ease-in-out',
        scale: 'active:scale-98',
        opacity: 'active:opacity-90'
      };
    
    case 'harmonyos':
      return {
        duration: 'duration-250',
        easing: 'ease-out',
        scale: 'active:scale-96',
        opacity: 'active:opacity-85'
      };
    
    default:
      return {
        duration: 'duration-150',
        easing: 'ease-in-out',
        scale: 'hover:scale-105',
        opacity: 'hover:opacity-90'
      };
  }
};

export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window === 'undefined') return;
  
  const platformInfo = detectPlatform();
  
  if (!platformInfo.supportsHaptics) return;
  
  // For devices with vibration API
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50]
    };
    navigator.vibrate(patterns[type]);
  }
  
  // For iOS devices with haptic feedback
  if ((window as any).DeviceMotionEvent && platformInfo.platform === 'ios') {
    try {
      const intensity = type === 'light' ? 0.3 : type === 'medium' ? 0.6 : 1.0;
      (window as any).navigator.vibrate?.(intensity * 100);
    } catch (e) {
      // Fallback to basic vibration
      navigator.vibrate?.(type === 'light' ? 10 : type === 'medium' ? 20 : 50);
    }
  }
};

export const getGestureHandlers = (platformInfo: PlatformInfo) => {
  if (!platformInfo.supportsTouchGestures) {
    return {
      onPointerDown: undefined,
      onPointerUp: undefined,
      onTouchStart: undefined,
      onTouchEnd: undefined
    };
  }

  return {
    onPointerDown: () => triggerHapticFeedback('light'),
    onPointerUp: undefined,
    onTouchStart: () => triggerHapticFeedback('light'),
    onTouchEnd: undefined
  };
};

export const usePlatform = () => {
  const platformInfo = detectPlatform();
  
  return {
    ...platformInfo,
    getInteractionStyles: () => getInteractionStyles(platformInfo),
    getAnimationPreset: () => getAnimationPreset(platformInfo),
    getGestureHandlers: () => getGestureHandlers(platformInfo),
    triggerHapticFeedback
  };
};