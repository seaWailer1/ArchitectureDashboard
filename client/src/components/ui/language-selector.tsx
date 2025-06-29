import React from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇪🇬' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'minimal';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'default',
  showFlag = true,
  showNativeName = true,
  className = '',
}) => {
  const { language, setLanguage, tm } = useLanguage();
  
  const currentLanguage = languages.find(lang => lang.code === language);
  
  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    
    // Announce language change for screen readers
    const announcement = `Language changed to ${languages.find(l => l.code === newLanguage)?.name}`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);
    setTimeout(() => document.body.removeChild(ariaLive), 1000);
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={`h-8 w-8 p-0 ${className}`}
            aria-label={`Current language: ${currentLanguage?.name}. Click to change language`}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between cursor-pointer ${
                language === lang.code ? 'bg-accent' : ''
              }`}
              role="menuitemradio"
              aria-checked={language === lang.code}
            >
              <div className="flex items-center gap-2">
                {showFlag && <span className="text-sm">{lang.flag}</span>}
                <span className="text-sm">{lang.name}</span>
              </div>
              {language === lang.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`gap-1 ${className}`}
            aria-label={`Current language: ${currentLanguage?.name}. Click to change language`}
          >
            {showFlag && currentLanguage && (
              <span className="text-sm">{currentLanguage.flag}</span>
            )}
            <span className="text-sm font-medium">
              {currentLanguage?.code.toUpperCase()}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between cursor-pointer ${
                language === lang.code ? 'bg-accent' : ''
              }`}
              role="menuitemradio"
              aria-checked={language === lang.code}
            >
              <div className="flex items-center gap-2">
                {showFlag && <span className="text-sm">{lang.flag}</span>}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.name}</span>
                  {showNativeName && lang.name !== lang.nativeName && (
                    <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                  )}
                </div>
              </div>
              {language === lang.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 ${className}`}
          aria-label={`Current language: ${currentLanguage?.name}. Click to change language`}
        >
          <Globe className="h-4 w-4" />
          {showFlag && currentLanguage && (
            <span className="text-sm">{currentLanguage.flag}</span>
          )}
          <span className="font-medium">
            {showNativeName && currentLanguage ? currentLanguage.nativeName : currentLanguage?.name}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          {tm.selectLanguage || 'Select Language'}
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center justify-between cursor-pointer ${
              language === lang.code ? 'bg-accent' : ''
            }`}
            role="menuitemradio"
            aria-checked={language === lang.code}
          >
            <div className="flex items-center gap-3">
              {showFlag && <span className="text-lg">{lang.flag}</span>}
              <div className="flex flex-col">
                <span className="font-medium">{lang.name}</span>
                {showNativeName && lang.name !== lang.nativeName && (
                  <span className="text-sm text-muted-foreground">{lang.nativeName}</span>
                )}
              </div>
            </div>
            {language === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;