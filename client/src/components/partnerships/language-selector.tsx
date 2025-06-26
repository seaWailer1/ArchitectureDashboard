import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PartnershipI18n, SupportedLanguage } from "@/lib/i18n-partnerships";

interface LanguageSelectorProps {
  i18n: PartnershipI18n;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export default function LanguageSelector({ i18n, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = i18n.getCurrentLanguage();
  const supportedLanguages = i18n.getSupportedLanguages();
  const t = i18n.getTranslations();

  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLang);

  const handleLanguageSelect = (language: SupportedLanguage) => {
    i18n.setLanguage(language);
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentLanguageInfo?.nativeName || 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium text-gray-700 border-b">
          {t.selectLanguage}
        </div>
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className={`flex items-center justify-between cursor-pointer ${
              currentLang === language.code ? 'bg-blue-50 text-blue-700' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-gray-500">{language.name}</span>
            </div>
            {currentLang === language.code && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}