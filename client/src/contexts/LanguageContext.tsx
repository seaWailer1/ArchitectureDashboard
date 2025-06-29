import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, ComponentLibraryTranslations } from '@/lib/i18n-component-library';

export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'sw';

export interface CulturalSettings {
  direction: 'ltr' | 'rtl';
  currency: string;
  numberFormat: Intl.NumberFormat;
  dateFormat: Intl.DateTimeFormat;
  locale: string;
  timeZone: string;
}

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: ComponentLibraryTranslations;
  culturalSettings: CulturalSettings;
  isRTL: boolean;
  formatCurrency: (amount: number) => string;
  formatNumber: (value: number) => string;
  formatDate: (date: Date) => string;
}

const defaultCulturalSettings: Record<SupportedLanguage, CulturalSettings> = {
  en: {
    direction: 'ltr',
    currency: 'USD',
    numberFormat: new Intl.NumberFormat('en-US'),
    dateFormat: new Intl.DateTimeFormat('en-US'),
    locale: 'en-US',
    timeZone: 'UTC',
  },
  fr: {
    direction: 'ltr',
    currency: 'XOF', // West African CFA franc
    numberFormat: new Intl.NumberFormat('fr-FR'),
    dateFormat: new Intl.DateTimeFormat('fr-FR'),
    locale: 'fr-FR',
    timeZone: 'Africa/Abidjan',
  },
  ar: {
    direction: 'rtl',
    currency: 'EGP', // Egyptian Pound
    numberFormat: new Intl.NumberFormat('ar-EG'),
    dateFormat: new Intl.DateTimeFormat('ar-EG'),
    locale: 'ar-EG',
    timeZone: 'Africa/Cairo',
  },
  sw: {
    direction: 'ltr',
    currency: 'KES', // Kenyan Shilling
    numberFormat: new Intl.NumberFormat('sw-KE'),
    dateFormat: new Intl.DateTimeFormat('sw-KE'),
    locale: 'sw-KE',
    timeZone: 'Africa/Nairobi',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('afriPay-language');
    if (stored && ['en', 'fr', 'ar', 'sw'].includes(stored)) {
      return stored as SupportedLanguage;
    }
    
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('ar')) return 'ar';
    if (browserLang.startsWith('sw')) return 'sw';
    
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('afriPay-language', lang);
    
    // Update document direction and lang attribute
    document.documentElement.dir = defaultCulturalSettings[lang].direction;
    document.documentElement.lang = lang;
  };

  const culturalSettings = defaultCulturalSettings[language];
  const isRTL = culturalSettings.direction === 'rtl';
  const t = translations[language];

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(culturalSettings.locale, {
        style: 'currency',
        currency: culturalSettings.currency,
      }).format(amount);
    } catch {
      // Fallback for unsupported currencies
      return `${culturalSettings.currency} ${culturalSettings.numberFormat.format(amount)}`;
    }
  };

  const formatNumber = (value: number): string => {
    return culturalSettings.numberFormat.format(value);
  };

  const formatDate = (date: Date): string => {
    return culturalSettings.dateFormat.format(date);
  };

  // Set initial document direction and language
  useEffect(() => {
    document.documentElement.dir = culturalSettings.direction;
    document.documentElement.lang = language;
    
    // Add CSS class for RTL styling
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language, culturalSettings.direction, isRTL]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    culturalSettings,
    isRTL,
    formatCurrency,
    formatNumber,
    formatDate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};