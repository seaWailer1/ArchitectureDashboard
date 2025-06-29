import React from 'react';
import { Globe, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';

const languageOptions: Array<{
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}> = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    region: 'Global',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'West Africa',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇪🇬',
    region: 'North Africa',
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    region: 'East Africa',
  },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'compact';
  showRegion?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'default',
  showRegion = true,
}) => {
  const { language, setLanguage, isRTL } = useLanguage();
  
  const currentLanguage = languageOptions.find(lang => lang.code === language);

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`min-w-[44px] min-h-[44px] gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{currentLanguage?.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? 'start' : 'end'}
          className="w-48"
        >
          {languageOptions.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`cursor-pointer ${isRTL ? 'flex-row-reverse' : ''} ${
                language === lang.code ? 'bg-primary/10' : ''
              }`}
            >
              <div className={`flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-lg">{lang.flag}</span>
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{lang.name}</div>
                </div>
                {language === lang.code && (
                  <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 min-h-[48px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Languages className="w-4 h-4" />
          <div className={`flex flex-col items-start ${isRTL ? 'items-end' : 'items-start'}`}>
            <span className="text-sm font-medium">{currentLanguage?.nativeName}</span>
            {showRegion && (
              <span className="text-xs text-muted-foreground">{currentLanguage?.region}</span>
            )}
          </div>
          <span className="text-lg">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? 'start' : 'end'}
        className="w-64"
      >
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer p-4 ${isRTL ? 'flex-row-reverse' : ''} ${
              language === lang.code ? 'bg-primary/10' : ''
            }`}
          >
            <div className={`flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-xl">{lang.flag}</span>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="font-medium text-sm">{lang.nativeName}</div>
                <div className="text-xs text-muted-foreground">{lang.name}</div>
                {showRegion && (
                  <div className="text-xs text-muted-foreground mt-1">{lang.region}</div>
                )}
              </div>
              {language === lang.code && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};