
"use client";

import { useCallback, useMemo, useState } from "react";

interface UsePaginationProps<T> {
  initialItems?: T[];
  totalItems: number;
  pageSize: number;
  fetchPage: (offset: number, limit: number) => Promise<T[]>;
}

export function usePagination<T>({
  initialItems = [],
  totalItems,
  pageSize,
  fetchPage
}: UsePaginationProps<T>) {
  const [pages, setPages] = useState<Map<number, T[]>>(
    () => initialItems.length > 0
      ? new Map([[0, initialItems]])
      : new Map()
  );

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

  const onLoadPage = useCallback(async (targetPage: number) => {
    if (
      targetPage < 0 ||
      targetPage >= totalPages ||
      pages.has(targetPage)
    ) return;

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
  }, [pages, totalPages, pageSize, fetchPage]);

  const onGoToPage = useCallback(async (targetPage: number) => {
    if (targetPage < 0 || targetPage >= totalPages) return;

    await onLoadPage(targetPage);
    setPage(targetPage);
  }, [totalPages, onLoadPage]);

  const onNextPage = () => {
    if (hasNextPage) return onGoToPage(page + 1);
  };

  const onPrevPage = () => {
    if (hasPrevPage) setPage(prev => prev - 1);
  };

  const updatePages = useCallback(
    (updater: (items: T[]) => T[]) => {
      setPages(prev => {
        const next = new Map(prev);

        for (const [key, items] of next) {
          next.set(key, updater(items));
        }

        return next;
      });
    },
    []
  );

  return {
    items,
    pageItems,
    page,
    totalPages,
    loading,
    hasNextPage,
    hasPrevPage,
    onLoadPage,
    onGoToPage,
    onNextPage,
    onPrevPage,
    updatePages
  };
}
