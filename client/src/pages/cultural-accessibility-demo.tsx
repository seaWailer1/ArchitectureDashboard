import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMultilingualAccessibility } from '@/components/ui/multilingual-accessibility-provider';
import CulturalAccessibilityEnhancer from '@/components/ui/cultural-accessibility-enhancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/layout/app-header';
import BottomNavigation from '@/components/layout/bottom-navigation';
import { 
  Globe, 
  Accessibility, 
  Volume2, 
  Eye,
  Keyboard,
  Languages,
  Smartphone,
  Users,
  Heart
} from 'lucide-react';
import { formatCulturalNumber } from '@/lib/cultural-accessibility';

export default function CulturalAccessibilityDemo() {
  const { language, tm, isRTL, formatCurrency } = useLanguage();
  const { 
    settings, 
    generateAriaLabel, 
    announceChange, 
    keyboardShortcuts,
    isScreenReaderOptimized,
    speechRate 
  } = useMultilingualAccessibility();

  const demoData = {
    balance: 15750.50,
    transactions: 12,
    notifications: 3,
    languages: ['English', 'Français', 'العربية', 'Kiswahili']
  };

  const handleDemoAction = (action: string) => {
    announceChange(`Demonstrated ${action} with cultural accessibility`, 'polite');
  };

  const culturalFeatures = [
    {
      icon: Globe,
      title: {
        en: 'Cultural Context',
        fr: 'Contexte Culturel',
        ar: 'السياق الثقافي',
        sw: 'Mazingira ya Kitamaduni'
      }[language],
      description: {
        en: 'Interface adapts to cultural reading patterns and expectations',
        fr: 'L\'interface s\'adapte aux modèles de lecture et attentes culturels',
        ar: 'تتكيف الواجهة مع أنماط القراءة والتوقعات الثقافية',
        sw: 'Mazingira yanabadilika kulingana na mifumo ya kusoma na matarajio ya kitamaduni'
      }[language],
      status: 'Active'
    },
    {
      icon: Volume2,
      title: {
        en: 'Voice Synthesis',
        fr: 'Synthèse Vocale',
        ar: 'تركيب الصوت',
        sw: 'Muundo wa Sauti'
      }[language],
      description: {
        en: 'Natural language voice output optimized for each cultural context',
        fr: 'Sortie vocale en langage naturel optimisée pour chaque contexte culturel',
        ar: 'إخراج صوتي باللغة الطبيعية محسّن لكل سياق ثقافي',
        sw: 'Utoaji wa sauti wa lugha asilia ulioboreshwa kwa kila mazingira ya kitamaduni'
      }[language],
      status: isScreenReaderOptimized ? 'Active' : 'Available'
    },
    {
      icon: Eye,
      title: {
        en: 'Visual Enhancement',
        fr: 'Amélioration Visuelle',
        ar: 'التحسين البصري',
        sw: 'Uboreshaji wa Kuona'
      }[language],
      description: {
        en: 'High contrast, large fonts, and culturally appropriate visual cues',
        fr: 'Contraste élevé, grandes polices et indices visuels culturellement appropriés',
        ar: 'تباين عالي وخطوط كبيرة وإشارات بصرية مناسبة ثقافياً',
        sw: 'Utofauti mkubwa, fonti kubwa, na dalili za kuona zinazofaa kitamaduni'
      }[language],
      status: 'Configurable'
    },
    {
      icon: Keyboard,
      title: {
        en: 'Navigation Enhancement',
        fr: 'Amélioration de Navigation',
        ar: 'تحسين التنقل',
        sw: 'Uboreshaji wa Urambazaji'
      }[language],
      description: {
        en: 'Cultural keyboard shortcuts and navigation patterns',
        fr: 'Raccourcis clavier culturels et modèles de navigation',
        ar: 'اختصارات لوحة المفاتيح الثقافية وأنماط التنقل',
        sw: 'Njia za mkato za kibodi za kitamaduni na mifumo ya urambazaji'
      }[language],
      status: 'Active'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      <AppHeader />

      <main 
        className="container mx-auto px-4 py-6 pb-20 max-w-6xl"
        id="main-content"
        tabIndex={-1}
        role="main"
        aria-label={generateAriaLabel('Cultural accessibility demonstration content', 'navigation')}
      >
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Accessibility className="w-8 h-8 text-blue-600" />
              <Languages className="w-8 h-8 text-green-600" />
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {tm.appName} Cultural Accessibility
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {language === 'en' && 'Experience how AfriPay adapts to your language, culture, and accessibility needs'}
              {language === 'fr' && 'Découvrez comment AfriPay s\'adapte à votre langue, culture et besoins d\'accessibilité'}
              {language === 'ar' && 'اكتشف كيف يتكيف AfriPay مع لغتك وثقافتك واحتياجاتك لإمكانية الوصول'}
              {language === 'sw' && 'Gundua jinsi AfriPay inavyobadilika kulingana na lugha, utamaduni, na mahitaji yako ya ufikivu'}
            </p>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-sm">
                {language.toUpperCase()} Interface
              </Badge>
              <Badge variant="outline" className="text-sm">
                {settings.readingDirection.toUpperCase()} Reading
              </Badge>
              {isScreenReaderOptimized && (
                <Badge className="bg-green-100 text-green-800 text-sm">
                  Screen Reader Optimized
                </Badge>
              )}
            </div>
          </div>

          {/* Cultural Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {culturalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-200"
                  role="article"
                  aria-label={generateAriaLabel(`${feature.title} feature`, 'button')}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <span>{feature.title}</span>
                      <Badge 
                        variant={feature.status === 'Active' ? 'default' : 'outline'}
                        className="ml-auto text-xs"
                      >
                        {feature.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Live Demo Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6" />
                Live Cultural Data Example
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Display */}
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {tm.totalBalance}
                  </h3>
                  <p 
                    className={`text-3xl font-bold text-green-600 ${settings.numberFormat === 'arabic' ? 'number-arabic' : 'number-western'}`}
                    aria-label={generateAriaLabel(`Balance: ${formatCurrency(demoData.balance)}`, 'status')}
                  >
                    {formatCurrency(demoData.balance)}
                  </p>
                </div>

                {/* Transaction Count */}
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {tm.recentTransactions}
                  </h3>
                  <p 
                    className={`text-3xl font-bold text-blue-600 ${settings.numberFormat === 'arabic' ? 'number-arabic' : 'number-western'}`}
                    aria-label={generateAriaLabel(`${formatCulturalNumber(demoData.transactions, language)} transactions`, 'status')}
                  >
                    {formatCulturalNumber(demoData.transactions, language)}
                  </p>
                </div>

                {/* Speech Rate */}
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Speech Rate
                  </h3>
                  <p 
                    className={`text-3xl font-bold text-purple-600 ${settings.numberFormat === 'arabic' ? 'number-arabic' : 'number-western'}`}
                    aria-label={generateAriaLabel(`Speech rate: ${speechRate} words per minute`, 'status')}
                  >
                    {formatCulturalNumber(speechRate, language)} WPM
                  </p>
                </div>
              </div>

              {/* Interactive Demo Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={() => handleDemoAction('balance announcement')}
                  className="flex items-center gap-2"
                  aria-label={generateAriaLabel('Announce balance with cultural context', 'button')}
                >
                  <Volume2 className="w-4 h-4" />
                  Announce Balance
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDemoAction('cultural greeting')}
                  className="flex items-center gap-2"
                  aria-label={generateAriaLabel('Test cultural greeting', 'button')}
                >
                  <Users className="w-4 h-4" />
                  Cultural Greeting
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDemoAction('navigation guidance')}
                  className="flex items-center gap-2"
                  aria-label={generateAriaLabel('Test navigation guidance', 'button')}
                >
                  <Keyboard className="w-4 h-4" />
                  Navigation Guide
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Settings Panel */}
          <CulturalAccessibilityEnhancer />

          {/* Cultural Information */}
          <Card>
            <CardHeader>
              <CardTitle>Cultural Accessibility Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Current Language Settings</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Language:</strong> {settings.voicePreference[0]}</li>
                    <li><strong>Reading Direction:</strong> {settings.readingDirection.toUpperCase()}</li>
                    <li><strong>Speech Rate:</strong> {speechRate} WPM</li>
                    <li><strong>Navigation Style:</strong> {settings.navigationPreference}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cultural Keyboard Shortcuts</h4>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(keyboardShortcuts).map(([action, shortcut]) => (
                      <li key={action}>
                        <strong>{shortcut}:</strong> {action.replace('-', ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}