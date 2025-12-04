'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/LanguageContext';
import { Check } from 'lucide-react';

const FranceFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="h-4 w-5 mr-2">
        <rect width="1" height="2" fill="#002395"/>
        <rect width="1" height="2" x="1" fill="#fff"/>
        <rect width="1" height="2" x="2" fill="#ed2939"/>
    </svg>
);

const GermanyFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" className="h-4 w-5 mr-2">
        <rect width="5" height="3" fill="#000"/>
        <rect width="5" height="2" y="1" fill="#D00"/>
        <rect width="5" height="1" y="2" fill="#FFCE00"/>
    </svg>
);

const UKFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="h-4 w-5 mr-2">
      <clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath>
      <clipPath id="b"><path d="M30 15h30v15zm0 0v15H0zm0 0H0V0zm0 0v-15h30z"/></clipPath>
      <g clipPath="url(#a)">
        <path d="M0 0v30h60V0z" fill="#012169"/>
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
        <path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
)

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {language.toUpperCase()}
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('de')} className="flex items-center justify-between">
          <div className="flex items-center">
            <GermanyFlag />
            Deutsch
          </div>
          {language === 'de' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')} className="flex items-center justify-between">
          <div className="flex items-center">
             <FranceFlag />
            Français
          </div>
          {language === 'fr' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => setLanguage('en')} className="flex items-center justify-between">
          <div className="flex items-center">
             <UKFlag />
            English
          </div>
          {language === 'en' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
