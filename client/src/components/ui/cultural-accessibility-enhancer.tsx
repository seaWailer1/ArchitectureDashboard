import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMultilingualAccessibility } from '@/components/ui/multilingual-accessibility-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, 
  Eye, 
  Keyboard, 
  MousePointer, 
  Languages, 
  Accessibility,
  Settings,
  Globe,
  Type,
  Palette
} from 'lucide-react';
import { formatCulturalNumber } from '@/lib/cultural-accessibility';

interface AccessibilityPreferences {
  enhancedDescriptions: boolean;
  voiceGuidance: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  largeFonts: boolean;
  speechRate: number;
  keyboardNavigation: boolean;
  screenReaderMode: boolean;
}

export const CulturalAccessibilityEnhancer: React.FC = () => {
  const { language, tm, isRTL } = useLanguage();
  const { 
    settings, 
    generateAriaLabel, 
    announceChange, 
    keyboardShortcuts, 
    isScreenReaderOptimized,
    speechRate 
  } = useMultilingualAccessibility();

  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    const stored = localStorage.getItem(`afriPay-accessibility-${language}`);
    return stored ? JSON.parse(stored) : {
      enhancedDescriptions: true,
      voiceGuidance: false,
      reducedMotion: false,
      highContrast: false,
      largeFonts: false,
      speechRate: speechRate,
      keyboardNavigation: true,
      screenReaderMode: isScreenReaderOptimized
    };
  });

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem(`afriPay-accessibility-${language}`, JSON.stringify(preferences));
  }, [preferences, language]);

  // Apply accessibility preferences to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large fonts
    if (preferences.largeFonts) {
      root.classList.add('large-fonts');
    } else {
      root.classList.remove('large-fonts');
    }
    
    // Reduced motion
    if (preferences.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Configure speech synthesis
    if (preferences.voiceGuidance && 'speechSynthesis' in window) {
      speechSynthesis.cancel(); // Reset any ongoing speech
    }
  }, [preferences]);

  const handlePreferenceChange = (key: keyof AccessibilityPreferences, value: boolean | number) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    // Announce change with cultural context
    const changeMessage = {
      'en': `${key} ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : `set to ${value}`}`,
      'fr': `${key} ${typeof value === 'boolean' ? (value ? 'activé' : 'désactivé') : `défini à ${value}`}`,
      'ar': `${key} ${typeof value === 'boolean' ? (value ? 'مُفعل' : 'مُعطل') : `مُحدد على ${value}`}`,
      'sw': `${key} ${typeof value === 'boolean' ? (value ? 'imewashwa' : 'imezimwa') : `imewekwa kwa ${value}`}`
    }[language];
    
    announceChange(changeMessage, 'polite');
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && preferences.voiceGuidance) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = {
        'en': 'en-US',
        'fr': 'fr-FR',
        'ar': 'ar-SA',
        'sw': 'sw-KE'
      }[language] || 'en-US';
      
      utterance.rate = preferences.speechRate / 100;
      speechSynthesis.speak(utterance);
    }
  };

  const testAccessibility = () => {
    const testMessage = {
      'en': 'Accessibility test: All systems functioning properly for English interface',
      'fr': 'Test d\'accessibilité: Tous les systèmes fonctionnent correctement pour l\'interface française',
      'ar': 'اختبار إمكانية الوصول: جميع الأنظمة تعمل بشكل صحيح للواجهة العربية',
      'sw': 'Jaribio la ufikivu: Mifumo yote inafanya kazi vizuri kwa mazingira ya Kiswahili'
    }[language];
    
    speakText(testMessage);
    announceChange(testMessage, 'assertive');
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Accessibility className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {language === 'en' ? 'Accessibility Settings' :
           language === 'fr' ? 'Paramètres d\'Accessibilité' :
           language === 'ar' ? 'إعدادات إمكانية الوصول' :
           'Mipangilio ya Ufikivu'}
        </h2>
        <Badge variant="outline" className="text-xs">
          {language.toUpperCase()}
        </Badge>
      </div>

      {/* Cultural Context Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Cultural Accessibility Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Reading Direction:</strong> {settings.readingDirection.toUpperCase()}
            </div>
            <div>
              <strong>Speech Rate:</strong> {formatCulturalNumber(settings.speechRate, language)} WPM
            </div>
            <div>
              <strong>Navigation Style:</strong> {settings.navigationPreference}
            </div>
            <div>
              <strong>Scanning Pattern:</strong> {settings.scanningPattern}
            </div>
          </div>
          
          {/* Color Interpretations */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Cultural Color Meanings:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>{settings.colorInterpretation.success}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>{settings.colorInterpretation.warning}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>{settings.colorInterpretation.error}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>{settings.colorInterpretation.info}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Accessibility Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Descriptions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <label className="font-medium">Enhanced Descriptions</label>
                <p className="text-sm text-gray-600">Detailed cultural context for screen readers</p>
              </div>
            </div>
            <Switch
              checked={preferences.enhancedDescriptions}
              onCheckedChange={(value) => handlePreferenceChange('enhancedDescriptions', value)}
              aria-label={generateAriaLabel('Toggle enhanced descriptions', 'button')}
            />
          </div>

          {/* Voice Guidance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <div>
                <label className="font-medium">Voice Guidance</label>
                <p className="text-sm text-gray-600">Spoken feedback in your language</p>
              </div>
            </div>
            <Switch
              checked={preferences.voiceGuidance}
              onCheckedChange={(value) => handlePreferenceChange('voiceGuidance', value)}
              aria-label={generateAriaLabel('Toggle voice guidance', 'button')}
            />
          </div>

          {/* Speech Rate */}
          {preferences.voiceGuidance && (
            <div className="space-y-2">
              <label className="font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                Speech Rate: {preferences.speechRate} WPM
              </label>
              <Slider
                value={[preferences.speechRate]}
                onValueChange={([value]) => handlePreferenceChange('speechRate', value)}
                min={80}
                max={300}
                step={10}
                className="w-full"
                aria-label={generateAriaLabel('Adjust speech rate', 'input')}
              />
            </div>
          )}

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-gray-600" />
              <div>
                <label className="font-medium">High Contrast Mode</label>
                <p className="text-sm text-gray-600">Enhanced color contrast for better visibility</p>
              </div>
            </div>
            <Switch
              checked={preferences.highContrast}
              onCheckedChange={(value) => handlePreferenceChange('highContrast', value)}
              aria-label={generateAriaLabel('Toggle high contrast mode', 'button')}
            />
          </div>

          {/* Large Fonts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-gray-600" />
              <div>
                <label className="font-medium">Large Fonts</label>
                <p className="text-sm text-gray-600">Increase text size for better readability</p>
              </div>
            </div>
            <Switch
              checked={preferences.largeFonts}
              onCheckedChange={(value) => handlePreferenceChange('largeFonts', value)}
              aria-label={generateAriaLabel('Toggle large fonts', 'button')}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MousePointer className="w-5 h-5 text-gray-600" />
              <div>
                <label className="font-medium">Reduced Motion</label>
                <p className="text-sm text-gray-600">Minimize animations and transitions</p>
              </div>
            </div>
            <Switch
              checked={preferences.reducedMotion}
              onCheckedChange={(value) => handlePreferenceChange('reducedMotion', value)}
              aria-label={generateAriaLabel('Toggle reduced motion', 'button')}
            />
          </div>

          {/* Keyboard Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Keyboard className="w-5 h-5 text-gray-600" />
              <div>
                <label className="font-medium">Enhanced Keyboard Navigation</label>
                <p className="text-sm text-gray-600">Cultural keyboard shortcuts and navigation</p>
              </div>
            </div>
            <Switch
              checked={preferences.keyboardNavigation}
              onCheckedChange={(value) => handlePreferenceChange('keyboardNavigation', value)}
              aria-label={generateAriaLabel('Toggle keyboard navigation', 'button')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      {preferences.keyboardNavigation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Cultural Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(keyboardShortcuts).map(([action, shortcut]) => (
                <div key={action} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="capitalize">{action.replace('-', ' ')}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {shortcut}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Button */}
      <div className="flex gap-4">
        <Button 
          onClick={testAccessibility}
          className="flex items-center gap-2"
          aria-label={generateAriaLabel('Test accessibility features', 'button')}
        >
          <Volume2 className="w-4 h-4" />
          Test Accessibility
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => speakText(tm.welcome || 'Welcome to AfriPay')}
          className="flex items-center gap-2"
          aria-label={generateAriaLabel('Test voice synthesis', 'button')}
        >
          <Languages className="w-4 h-4" />
          Test Voice
        </Button>
      </div>

      {/* Screen Reader Status */}
      {isScreenReaderOptimized && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Accessibility className="w-5 h-5" />
              <span className="font-medium">Screen Reader Optimized</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Interface optimized for screen reader accessibility in {language.toUpperCase()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CulturalAccessibilityEnhancer;