import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePlatform } from '@/lib/platform-detection';
import { cn } from '@/lib/utils';

interface NativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
}

export const NativeModal: React.FC<NativeModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
}) => {
  const platform = usePlatform();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      platform.triggerHapticFeedback('light');
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, platform]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      platform.triggerHapticFeedback('medium');
    }
  };

  const getModalStyles = () => {
    const baseModalStyles = "relative bg-white dark:bg-gray-900 shadow-xl";
    
    switch (platform.platform) {
      case 'ios':
        return `
          ${baseModalStyles}
          rounded-t-3xl
          backdrop-blur-xl bg-white/95 dark:bg-gray-900/95
          border-t border-gray-200/50 dark:border-gray-700/50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `;
      
      case 'android':
        return `
          ${baseModalStyles}
          rounded-t-2xl
          transform transition-all duration-200 ease-in-out
          ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-95'}
          elevation-24
        `;
      
      case 'huawei':
        return `
          ${baseModalStyles}
          rounded-t-3xl
          bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
          backdrop-blur-md
          border-t border-gray-200/60 dark:border-gray-700/60
          transform transition-all duration-250 ease-out
          ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-98'}
        `;
      
      default:
        return `
          ${baseModalStyles}
          rounded-t-lg
          transform transition-all duration-150 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `;
    }
  };

  const getOverlayStyles = () => {
    const baseOverlay = "fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center";
    
    switch (platform.platform) {
      case 'ios':
        return `
          ${baseOverlay}
          bg-black/20 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `;
      
      case 'android':
        return `
          ${baseOverlay}
          bg-black/40
          transition-all duration-200 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `;
      
      case 'huawei':
        return `
          ${baseOverlay}
          bg-gradient-to-b from-black/20 to-black/40 backdrop-blur-md
          transition-all duration-250 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `;
      
      default:
        return `
          ${baseOverlay}
          bg-black/50
          transition-opacity duration-150 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `;
    }
  };

  const getSizeClasses = () => {
    if (platform.isMobile) {
      switch (size) {
        case 'small':
          return 'h-1/3 max-h-96';
        case 'medium':
          return 'h-1/2 max-h-[32rem]';
        case 'large':
          return 'h-2/3 max-h-[40rem]';
        case 'fullscreen':
          return 'h-full';
        default:
          return 'h-1/2 max-h-[32rem]';
      }
    } else {
      switch (size) {
        case 'small':
          return 'w-full max-w-md h-auto max-h-96';
        case 'medium':
          return 'w-full max-w-2xl h-auto max-h-[32rem]';
        case 'large':
          return 'w-full max-w-4xl h-auto max-h-[40rem]';
        case 'fullscreen':
          return 'w-full h-full max-w-none';
        default:
          return 'w-full max-w-2xl h-auto max-h-[32rem]';
      }
    }
  };

  const getHeaderStyles = () => {
    switch (platform.platform) {
      case 'ios':
        return "px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl";
      
      case 'android':
        return "px-6 py-4 border-b border-gray-200 dark:border-gray-700 elevation-1";
      
      case 'huawei':
        return "px-6 py-4 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800";
      
      default:
        return "px-6 py-4 border-b border-gray-200 dark:border-gray-700";
    }
  };

  const getPullIndicatorStyles = () => {
    if (!platform.isMobile) return "";
    
    const baseIndicator = "w-12 h-1 rounded-full mx-auto mb-4";
    
    switch (platform.platform) {
      case 'ios':
        return `${baseIndicator} bg-gray-300 dark:bg-gray-600`;
      
      case 'android':
        return `${baseIndicator} bg-gray-400 dark:bg-gray-500`;
      
      case 'huawei':
        return `${baseIndicator} bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500`;
      
      default:
        return `${baseIndicator} bg-gray-300 dark:bg-gray-600`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={getOverlayStyles()} onClick={handleBackdropClick}>
      <div className={cn(getModalStyles(), getSizeClasses())}>
        {/* Pull indicator for mobile */}
        {platform.isMobile && (
          <div className="pt-2">
            <div className={getPullIndicatorStyles()} />
          </div>
        )}
        
        {/* Header */}
        <div className={getHeaderStyles()}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  platform.platform === 'ios' 
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NativeModal;