import { SupportedLanguage } from '@/contexts/LanguageContext';

export interface CulturalAccessibilitySettings {
  // Screen reader and voice settings
  speechRate: number;
  voicePreference: string[];
  pronunciationGuides: Record<string, string>;
  
  // Reading patterns and navigation
  readingDirection: 'ltr' | 'rtl';
  scanningPattern: 'linear' | 'grid' | 'hierarchical';
  navigationPreference: 'sequential' | 'landmark' | 'heading';
  
  // Cultural UI preferences
  colorInterpretation: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Cultural symbols and icons
  currencySymbolPosition: 'before' | 'after';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  numberFormat: 'western' | 'eastern' | 'arabic';
  
  // Accessibility enhancements
  enhancedDescriptions: boolean;
  culturalContext: boolean;
  voiceoverOptimized: boolean;
  keyboardShortcuts: Record<string, string>;
  
  // Reading comprehension aids
  complexityLevel: 'simple' | 'standard' | 'advanced';
  culturalReferences: boolean;
  localExamples: boolean;
}

export const culturalAccessibilityConfig: Record<SupportedLanguage, CulturalAccessibilitySettings> = {
  en: {
    speechRate: 180, // words per minute
    voicePreference: ['en-US', 'en-GB', 'en-AU'],
    pronunciationGuides: {
      'AfriPay': 'AH-free-pay',
      'KES': 'Kenyan Shillings',
      'USD': 'US Dollars'
    },
    readingDirection: 'ltr',
    scanningPattern: 'linear',
    navigationPreference: 'sequential',
    colorInterpretation: {
      success: 'Green indicates success and positive actions',
      warning: 'Yellow/amber indicates caution and warnings', 
      error: 'Red indicates errors and critical issues',
      info: 'Blue indicates information and helpful tips'
    },
    currencySymbolPosition: 'before',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: 'western',
    enhancedDescriptions: true,
    culturalContext: true,
    voiceoverOptimized: true,
    keyboardShortcuts: {
      'skip-to-main': 'Alt+M',
      'skip-to-nav': 'Alt+N',
      'language-toggle': 'Alt+L'
    },
    complexityLevel: 'standard',
    culturalReferences: true,
    localExamples: true
  },
  
  fr: {
    speechRate: 160, // Slightly slower for French pronunciation
    voicePreference: ['fr-FR', 'fr-CA', 'fr-BE'],
    pronunciationGuides: {
      'AfriPay': 'Ah-free-pay',
      'XOF': 'Franc CFA de l\'Afrique de l\'Ouest',
      'EUR': 'Euros'
    },
    readingDirection: 'ltr',
    scanningPattern: 'hierarchical',
    navigationPreference: 'landmark',
    colorInterpretation: {
      success: 'Le vert indique le succès et les actions positives',
      warning: 'Le jaune indique la prudence et les avertissements',
      error: 'Le rouge indique les erreurs et problèmes critiques',
      info: 'Le bleu indique les informations et conseils utiles'
    },
    currencySymbolPosition: 'after',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: 'western',
    enhancedDescriptions: true,
    culturalContext: true,
    voiceoverOptimized: true,
    keyboardShortcuts: {
      'skip-to-main': 'Alt+P', // "Principal"
      'skip-to-nav': 'Alt+N', // "Navigation"
      'language-toggle': 'Alt+L' // "Langue"
    },
    complexityLevel: 'standard',
    culturalReferences: true,
    localExamples: true
  },
  
  ar: {
    speechRate: 140, // Slower for Arabic script complexity
    voicePreference: ['ar-SA', 'ar-EG', 'ar-AE'],
    pronunciationGuides: {
      'AfriPay': 'أفري-باي',
      'EGP': 'جنيه مصري',
      'SAR': 'ريال سعودي'
    },
    readingDirection: 'rtl',
    scanningPattern: 'grid', // Right-to-left grid scanning
    navigationPreference: 'heading',
    colorInterpretation: {
      success: 'الأخضر يشير إلى النجاح والإجراءات الإيجابية',
      warning: 'الأصفر يشير إلى الحذر والتحذيرات',
      error: 'الأحمر يشير إلى الأخطاء والمشاكل الحرجة',
      info: 'الأزرق يشير إلى المعلومات والنصائح المفيدة'
    },
    currencySymbolPosition: 'after',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h', // Common in Arab countries
    numberFormat: 'arabic',
    enhancedDescriptions: true,
    culturalContext: true,
    voiceoverOptimized: true,
    keyboardShortcuts: {
      'skip-to-main': 'Alt+ر', // "رئيسي" (Main)
      'skip-to-nav': 'Alt+ن', // "تنقل" (Navigation)
      'language-toggle': 'Alt+ل' // "لغة" (Language)
    },
    complexityLevel: 'standard',
    culturalReferences: true,
    localExamples: true
  },
  
  sw: {
    speechRate: 170, // Moderate pace for Swahili
    voicePreference: ['sw-KE', 'sw-TZ', 'sw-UG'],
    pronunciationGuides: {
      'AfriPay': 'Ah-free-pay',
      'KES': 'Shilingi ya Kenya',
      'TZS': 'Shilingi ya Tanzania'
    },
    readingDirection: 'ltr',
    scanningPattern: 'linear',
    navigationPreference: 'sequential',
    colorInterpretation: {
      success: 'Kijani kinaonyesha mafanikio na vitendo chanya',
      warning: 'Njano inaonyesha tahadhari na maonyo',
      error: 'Nyekundu inaonyesha makosa na matatizo makubwa',
      info: 'Bluu inaonyesha maelezo na vidokezo'
    },
    currencySymbolPosition: 'before',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: 'western',
    enhancedDescriptions: true,
    culturalContext: true,
    voiceoverOptimized: true,
    keyboardShortcuts: {
      'skip-to-main': 'Alt+M', // "Msingi"
      'skip-to-nav': 'Alt+U', // "Urambazaji"
      'language-toggle': 'Alt+L' // "Lugha"
    },
    complexityLevel: 'simple', // Simpler language for wider accessibility
    culturalReferences: true,
    localExamples: true
  }
};

export const getAccessibilitySettings = (language: SupportedLanguage): CulturalAccessibilitySettings => {
  return culturalAccessibilityConfig[language];
};

export const generateCulturalAriaLabel = (
  baseText: string, 
  language: SupportedLanguage, 
  context?: 'button' | 'link' | 'input' | 'status' | 'navigation'
): string => {
  const settings = getAccessibilitySettings(language);
  
  // Add cultural context based on language
  switch (language) {
    case 'ar':
      // Arabic: Add respectful prefix and context
      const arabicPrefixes = {
        button: 'زر: ',
        link: 'رابط: ',
        input: 'حقل إدخال: ',
        status: 'حالة: ',
        navigation: 'تنقل: '
      };
      return `${arabicPrefixes[context || 'button']}${baseText}`;
    
    case 'fr':
      // French: Add gendered articles and formal tone
      const frenchPrefixes = {
        button: 'Bouton : ',
        link: 'Lien : ',
        input: 'Champ de saisie : ',
        status: 'Statut : ',
        navigation: 'Navigation : '
      };
      return `${frenchPrefixes[context || 'button']}${baseText}`;
    
    case 'sw':
      // Swahili: Add respectful context
      const swahiliPrefixes = {
        button: 'Kitufe: ',
        link: 'Kiungo: ',
        input: 'Uga wa kuingiza: ',
        status: 'Hali: ',
        navigation: 'Urambazaji: '
      };
      return `${swahiliPrefixes[context || 'button']}${baseText}`;
    
    default:
      // English: Standard accessibility format
      const englishPrefixes = {
        button: 'Button: ',
        link: 'Link: ',
        input: 'Input field: ',
        status: 'Status: ',
        navigation: 'Navigation: '
      };
      return context ? `${englishPrefixes[context]}${baseText}` : baseText;
  }
};

export const getCulturalKeyboardShortcuts = (language: SupportedLanguage) => {
  return getAccessibilitySettings(language).keyboardShortcuts;
};

export const formatCulturalNumber = (
  number: number, 
  language: SupportedLanguage, 
  type: 'decimal' | 'currency' | 'percentage' = 'decimal'
): string => {
  const settings = getAccessibilitySettings(language);
  
  try {
    const locale = {
      'en': 'en-US',
      'fr': 'fr-FR', 
      'ar': 'ar-EG',
      'sw': 'sw-KE'
    }[language];
    
    if (type === 'currency') {
      // Use cultural currency formatting
      const currency = {
        'en': 'USD',
        'fr': 'XOF',
        'ar': 'EGP', 
        'sw': 'KES'
      }[language];
      
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(number);
    }
    
    return new Intl.NumberFormat(locale, {
      style: type === 'percentage' ? 'percent' : 'decimal'
    }).format(number);
    
  } catch (error) {
    // Fallback formatting
    return number.toString();
  }
};

export const announceCulturalChange = (
  message: string, 
  language: SupportedLanguage, 
  priority: 'polite' | 'assertive' = 'polite'
) => {
  // Create announcement for screen readers with cultural sensitivity
  const announcement = generateCulturalAriaLabel(message, language, 'status');
  
  const ariaLive = document.createElement('div');
  ariaLive.setAttribute('aria-live', priority);
  ariaLive.setAttribute('aria-atomic', 'true');
  ariaLive.setAttribute('aria-label', announcement);
  ariaLive.className = 'sr-only';
  ariaLive.textContent = announcement;
  
  document.body.appendChild(ariaLive);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(ariaLive);
  }, 1000);
};