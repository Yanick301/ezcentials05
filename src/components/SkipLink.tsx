'use client';

import Link from 'next/link';
import { TranslatedText } from '@/components/TranslatedText';
import { cn } from '@/lib/utils';

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className={cn(
        "absolute left-4 top-4 z-50 -translate-y-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
    >
      <TranslatedText fr="Aller au contenu principal" en="Skip to main content">
        Zum Hauptinhalt springen
      </TranslatedText>
    </Link>
  );
}










