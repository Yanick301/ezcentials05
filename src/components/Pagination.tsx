'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2 mt-12", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={
          currentPage === 1
            ? undefined
            : 'Previous page'
        }
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">
          <TranslatedText fr="Page précédente" en="Previous page">
            Vorherige Seite
          </TranslatedText>
        </span>
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              aria-label={
                isActive
                  ? undefined
                  : `Go to page ${pageNum}`
              }
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                isActive && 'pointer-events-none'
              )}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={
          currentPage === totalPages
            ? undefined
            : 'Next page'
        }
      >
        <span className="sr-only">
          <TranslatedText fr="Page suivante" en="Next page">
            Nächste Seite
          </TranslatedText>
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}







































