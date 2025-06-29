import React from 'react';
import { LucideIcon } from 'lucide-react';
import { usePlatform } from '@/lib/platform-detection';
import { cn } from '@/lib/utils';

interface NativeServiceCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  className?: string;
}

export const NativeServiceCard: React.FC<NativeServiceCardProps> = ({
  id,
  name,
  description,
  icon: Icon,
  color,
  onClick,
  className = '',
}) => {
  const platform = usePlatform();
  const interactionStyles = platform.getInteractionStyles();
  const animationPreset = platform.getAnimationPreset();
  const gestureHandlers = platform.getGestureHandlers();

  const handleClick = () => {
    platform.triggerHapticFeedback('light');
    onClick();
  };

  const getPlatformSpecificStyles = () => {
    switch (platform.platform) {
      case 'ios':
        return `
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
          border border-gray-200/50 dark:border-gray-700/50
          shadow-sm hover:shadow-md
          ${animationPreset.duration} ${animationPreset.scale}
        `;
      
      case 'android':
        return `
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          shadow-md hover:shadow-lg
          ${animationPreset.duration} ${animationPreset.scale}
          transform-gpu will-change-transform
        `;
      
      case 'huawei':
        return `
          bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
          border border-gray-200/60 dark:border-gray-700/60
          shadow-lg hover:shadow-xl
          ${animationPreset.duration} ${animationPreset.scale}
          backdrop-blur-sm
        `;
      
      default:
        return `
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          shadow-sm hover:shadow-md
          ${animationPreset.duration} hover:scale-105
        `;
    }
  };

  const getIconContainerStyles = () => {
    const baseIconStyles = "w-12 h-12 rounded-full flex items-center justify-center mb-3";
    
    switch (platform.platform) {
      case 'ios':
        return `${baseIconStyles} ${color} shadow-sm`;
      
      case 'android':
        return `${baseIconStyles} ${color} shadow-md`;
      
      case 'huawei':
        return `${baseIconStyles} ${color} shadow-lg ring-1 ring-black/5`;
      
      default:
        return `${baseIconStyles} ${color}`;
    }
  };

  const getTextStyles = () => {
    switch (platform.platform) {
      case 'ios':
        return {
          title: "text-lg font-semibold text-gray-900 dark:text-white mb-1 tracking-tight",
          description: "text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
        };
      
      case 'android':
        return {
          title: "text-lg font-medium text-gray-900 dark:text-white mb-1",
          description: "text-sm text-gray-600 dark:text-gray-400"
        };
      
      case 'huawei':
        return {
          title: "text-lg font-semibold text-gray-900 dark:text-white mb-1 tracking-wide",
          description: "text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
        };
      
      default:
        return {
          title: "text-lg font-medium text-gray-900 dark:text-white mb-1",
          description: "text-sm text-gray-600 dark:text-gray-400"
        };
    }
  };

  const textStyles = getTextStyles();

  return (
    <button
      className={cn(
        "w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        getPlatformSpecificStyles(),
        interactionStyles,
        className
      )}
      onClick={handleClick}
      {...gestureHandlers}
      role="button"
      aria-label={`Open ${name} service - ${description}`}
      tabIndex={0}
    >
      <div className="flex flex-col items-center text-center">
        <div className={getIconContainerStyles()}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className={textStyles.title}>
          {name}
        </h3>
        <p className={textStyles.description}>
          {description}
        </p>
      </div>
      
      {/* Platform-specific visual indicators */}
      {platform.platform === 'ios' && (
        <div className="absolute top-2 right-2 w-1 h-1 bg-blue-500 rounded-full opacity-60" />
      )}
      
      {platform.platform === 'android' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      )}
      
      {platform.platform === 'huawei' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 transition-opacity duration-250 group-hover:opacity-100" />
      )}
    </button>
  );
};

export default NativeServiceCard;