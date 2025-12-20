import { useMemo, useState } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export function usePagination<T>({
  items,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);

  const setPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    // Scroll to top of product list
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: startIndex + 1, // 1-based for display
    endIndex,
    totalItems: items.length,
  };
}







































