"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface UsePaginationOptions<T> {
  initialItems?: T[];
  initialTotalItems: number;
  pageSize?: number;
  fetchPage: (offset: number, limit: number) => Promise<T[]>;
}

export const usePagination = <T>({
  initialItems = [],
  initialTotalItems,
  pageSize = 25,
  fetchPage
}: UsePaginationOptions<T>) => {
  const [pages, setPages] = useState<Map<number, T[]>>(
    () => initialItems.length > 0 ? new Map([[0, initialItems]]) : new Map()
  );
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageItems = pages.get(page) ?? [];
  const hasNextPage = page + 1 < totalPages;
  const hasPrevPage = page > 0;

  const items = useMemo(
    () => Array.from(pages.entries())
      .sort(([a], [b]) => a - b)
      .flatMap(([, items]) => items),
    [pages]
  );


  const invalidatePages = useCallback(async () => {
    setPages(new Map());
    setPage(0);
    setLoading(true);

    try {
      const results = await fetchPage(0, pageSize);
      setPages(new Map([[0, results]]));
    } finally {
      setLoading(false);
    }
  }, [fetchPage, pageSize]);


  const onLoadMore = useCallback(async (targetPage: number) => {
    if (targetPage < 0 || targetPage >= totalPages || pages.has(targetPage)) return;

    setLoading(true);
    try {
      const results = await fetchPage(targetPage * pageSize, pageSize);
      setPages(prev => {
        if (prev.has(targetPage)) return prev;
        const next = new Map(prev);
        next.set(targetPage, results);
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [totalPages, pages, fetchPage, pageSize]);

  const onGoToPage = useCallback(async (targetPage: number) => {
    if (targetPage < 0 || targetPage >= totalPages) return;
    await onLoadMore(targetPage);
    setPage(targetPage);
  }, [totalPages, onLoadMore]);

  const onNextPage = useCallback(
    () => hasNextPage && onGoToPage(page + 1),
    [hasNextPage, page, onGoToPage]
  );

  const onPrevPage = useCallback(
    () => hasPrevPage && setPage(page - 1),
    [hasPrevPage, page]
  );

  const updatePages = useCallback(
    (updater: (pages: Map<number, T[]>) => Map<number, T[]>) => {
      setPages(updater);
    },
    []
  );

  return {
    pages,
    setPages: updatePages,
    invalidatePages,
    items,
    pageItems,
    page,
    setPage,
    totalItems,
    setTotalItems,
    totalPages,
    loading,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    onGoToPage,
    onLoadMore
  };
};