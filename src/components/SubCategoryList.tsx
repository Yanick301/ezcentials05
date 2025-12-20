'use client';

import Link from 'next/link';
import { TranslatedText } from './TranslatedText';
import type { SubCategory } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SubCategoryListProps {
  subcategories: SubCategory[];
  parentCategorySlug: string;
  className?: string;
}

export function SubCategoryList({ subcategories, parentCategorySlug, className }: SubCategoryListProps) {
  const { language } = useLanguage();
  const params = useParams();
  const currentSubcategory = params.subcategory as string | undefined;

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className={cn("mb-8 w-full", className)}>
      <h2 className="mb-4 text-base font-semibold text-foreground/80 sm:text-lg md:text-xl">
        <TranslatedText fr="Sous-catégories" en="Subcategories">Unterkategorien</TranslatedText>
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {subcategories.map((subcategory) => {
          const isActive = currentSubcategory === subcategory.slug;
          const href = `/products/${parentCategorySlug}/${subcategory.slug}`;
          
          return (
            <Link
              key={subcategory.id}
              href={href}
              prefetch={true}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                "sm:px-4 sm:py-2 sm:text-sm",
                "md:px-6 md:py-2.5 md:text-base",
                "hover:scale-105 hover:shadow-md active:scale-95",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground/80 hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <TranslatedText fr={subcategory.name_fr} en={subcategory.name_en}>
                {subcategory.name}
              </TranslatedText>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

