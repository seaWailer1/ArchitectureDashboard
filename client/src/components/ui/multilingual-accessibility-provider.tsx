import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import { 
  getAccessibilitySettings, 
  generateCulturalAriaLabel, 
  getCulturalKeyboardShortcuts,
  announceCulturalChange,
  CulturalAccessibilitySettings 
} from '@/lib/cultural-accessibility';

interface MultilingualAccessibilityContextType {
  settings: CulturalAccessibilitySettings;
  generateAriaLabel: (text: string, context?: 'button' | 'link' | 'input' | 'status' | 'navigation') => string;
  announceChange: (message: string, priority?: 'polite' | 'assertive') => void;
  keyboardShortcuts: Record<string, string>;
  isScreenReaderOptimized: boolean;
  speechRate: number;
  readingDirection: 'ltr' | 'rtl';
}

const MultilingualAccessibilityContext = createContext<MultilingualAccessibilityContextType | null>(null);

export const useMultilingualAccessibility = () => {
  const context = useContext(MultilingualAccessibilityContext);
  if (!context) {
    throw new Error('useMultilingualAccessibility must be used within a MultilingualAccessibilityProvider');
  }
  return context;
};

interface MultilingualAccessibilityProviderProps {
  children: ReactNode;
}

export const MultilingualAccessibilityProvider: React.FC<MultilingualAccessibilityProviderProps> = ({ 
  children 
}) => {
  const { language, isRTL } = useLanguage();
  const [settings, setSettings] = useState<CulturalAccessibilitySettings>(() => 
    getAccessibilitySettings(language)
  );
  const [isScreenReaderOptimized, setIsScreenReaderOptimized] = useState(false);

  // Update settings when language changes
  useEffect(() => {
    const newSettings = getAccessibilitySettings(language);
    setSettings(newSettings);
    
    // Announce language change culturally
    announceCulturalChange(
      `Language changed to ${language}. Interface optimized for cultural accessibility.`,
      language,
      'assertive'
    );
  }, [language]);

  // Detect screen reader usage
  useEffect(() => {
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = 
        window.navigator.userAgent.includes('NVDA') ||
        window.navigator.userAgent.includes('JAWS') ||
        window.navigator.userAgent.includes('VoiceOver') ||
        window.speechSynthesis !== undefined ||
        'speechSynthesis' in window;
        
      setIsScreenReaderOptimized(hasScreenReader);
      
      // Also check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion && settings.enhancedDescriptions) {
        // Optimize for users who prefer reduced motion
        setSettings(prev => ({ ...prev, speechRate: prev.speechRate * 0.8 }));
      }
    };

    detectScreenReader();
    
    // Listen for accessibility preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', detectScreenReader);
    
    return () => mediaQuery.removeEventListener('change', detectScreenReader);
  }, [settings.enhancedDescriptions]);

  // Set up cultural keyboard shortcuts
  useEffect(() => {
    const shortcuts = getCulturalKeyboardShortcuts(language);
    
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      const key = event.altKey ? `Alt+${event.key.toLowerCase()}` : event.key.toLowerCase();
      
      switch (key) {
        case shortcuts['skip-to-main'].toLowerCase():
          event.preventDefault();
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.focus();
            announceChange('Navigated to main content', 'assertive');
          }
          break;
          
        case shortcuts['skip-to-nav'].toLowerCase():
          event.preventDefault();
          const navigation = document.querySelector('[role="navigation"]');
          if (navigation instanceof HTMLElement) {
            navigation.focus();
            announceChange('Navigated to main navigation', 'assertive');
          }
          break;
          
        case shortcuts['language-toggle'].toLowerCase():
          event.preventDefault();
          const languageSelector = document.querySelector('[aria-label*="language"], [aria-label*="langue"], [aria-label*="لغة"], [aria-label*="lugha"]');
          if (languageSelector instanceof HTMLElement) {
            languageSelector.click();
            announceChange('Language selector activated', 'assertive');
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, [language]);

  // Configure speech synthesis for different languages
  useEffect(() => {
    if ('speechSynthesis' in window && settings.voiceoverOptimized) {
      const configureVoice = () => {
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          settings.voicePreference.some(pref => voice.lang.includes(pref))
        );
        
        if (preferredVoice) {
          // Store preferred voice for the application
          localStorage.setItem(`afriPay-voice-${language}`, preferredVoice.name);
        }
      };
      
      // Configure voice when voices are loaded
      if (speechSynthesis.getVoices().length > 0) {
        configureVoice();
      } else {
        speechSynthesis.addEventListener('voiceschanged', configureVoice);
      }
    }
  }, [language, settings.voicePreference, settings.voiceoverOptimized]);

  const generateAriaLabel = (
    text: string, 
    context?: 'button' | 'link' | 'input' | 'status' | 'navigation'
  ): string => {
    if (settings.enhancedDescriptions) {
      return generateCulturalAriaLabel(text, language, context);
    }
    return text;
  };

  const announceChange = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (isScreenReaderOptimized) {
      announceCulturalChange(message, language, priority);
    }
  };

  const value: MultilingualAccessibilityContextType = {
    settings,
    generateAriaLabel,
    announceChange,
    keyboardShortcuts: getCulturalKeyboardShortcuts(language),
    isScreenReaderOptimized,
    speechRate: settings.speechRate,
    readingDirection: settings.readingDirection
  };

  return (
    <MultilingualAccessibilityContext.Provider value={value}>
      {children}
    </MultilingualAccessibilityContext.Provider>
  );
};