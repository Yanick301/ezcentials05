'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { TranslatedText } from '@/components/TranslatedText';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';
import type { Category, Product } from '@/lib/types';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { language } = useLanguage();
  
  const getLabel = (item: BreadcrumbItem) => {
    return item.label;
  };

  const getHomeAriaLabel = () => {
    return language === 'fr' ? 'Accueil' : language === 'en' ? 'Home' : 'Startseite';
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol role="list" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link 
            href="/" 
            className="hover:text-foreground transition-colors flex items-center"
            aria-label={getHomeAriaLabel()}
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">
                {getLabel(item)}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {getLabel(item)}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function useBreadcrumbsForCategory(categorySlug: string): BreadcrumbItem[] {
  const { language } = useLanguage();
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];

  let categoryName: string;
  if (language === 'fr') {
    categoryName = category.name_fr;
  } else if (language === 'en') {
    categoryName = category.name_en;
  } else {
    categoryName = category.name;
  }

  return [
    { label: categoryName, href: `/products/${categorySlug}` }
  ];
}

export function useBreadcrumbsForProduct(product: Product, category?: Category): BreadcrumbItem[] {
  const { language } = useLanguage();

  let categoryName = category?.name || '';
  let productName = product.name;

  if (language === 'fr') {
    categoryName = category?.name_fr || '';
    productName = product.name_fr;
  } else if (language === 'en') {
    categoryName = category?.name_en || '';
    productName = product.name_en;
  }

  const items: BreadcrumbItem[] = [];
  
  if (category) {
    items.push({
      label: categoryName,
      href: `/products/${category.slug}`
    });
  }

  items.push({
    label: productName,
    href: `/product/${product.slug}`
  });

  return items;
}
