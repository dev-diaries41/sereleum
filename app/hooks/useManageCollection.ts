"use client";

import { useCallback, useMemo, useState } from "react";
import { Collection, CollectionId } from "@/app/types";
import { sereleumApiClient } from "../sereleum";
import { CollectionType } from "../enums/collections";

export const useManageCollections = <T extends CollectionType = CollectionType>(
  type: T,
  initialCollections: Collection<T>[] = [],
  totalCollections: number = 0,
  pageSize: number = 25
) => {
 const [pages, setPages] = useState<Map<number, Collection<T>[]>>(() => initialCollections.length > 0 ? new Map([[0, initialCollections]]) : new Map() );
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCollections / pageSize));
  const pageCollections = pages.get(page) ?? [];
  const hasNextPage = page + 1 < totalPages;
  const hasPrevPage = page > 0;

  const collections = useMemo(
    () => Array.from(pages.entries())
      .sort(([a], [b]) => a - b)
      .flatMap(([, items]) => items),
    [pages]
  );

  const onLoadMoreCollections = useCallback(async (targetPage: number) => {
    if (targetPage < 0 || targetPage >= totalPages || pages.has(targetPage)) return;

    setLoading(true);
    try {
      const results = await sereleumApiClient.getCollections(
        type,
        targetPage * pageSize,
        pageSize
      );

      setPages(prev => {
        if (prev.has(targetPage)) return prev;
        const next = new Map(prev);
        next.set(targetPage, results);
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [type, pageSize, totalPages, pages]);

  const onGoToPage = useCallback(async (targetPage: number) => {
    if (targetPage < 0 || targetPage >= totalPages) return;
    await onLoadMoreCollections(targetPage);
    setPage(targetPage);
  }, [totalPages, onLoadMoreCollections]);

  const onNextPage = () => hasNextPage && onGoToPage(page + 1);
  const onPrevPage = () => hasPrevPage && setPage(page - 1);

  const onRenameCollection = async (collectionId: CollectionId<T>, name: string) => {
    await sereleumApiClient.renameCollection(collectionId, name, type);
    setPages(prev => {
      const next = new Map(prev);
      for (const [key, items] of next) {
        next.set(key, items.map(c => c.id === collectionId ? { ...c, name } : c));
      }
      return next;
    });
  };

  const onMergeCollections = async (
    primaryCollectionId: CollectionId<T>,
    secondaryCollectionIds: CollectionId<T>[]
  ) => {
    const mergedCollection = await sereleumApiClient.mergeCollections(
      type,
      primaryCollectionId,
      secondaryCollectionIds
    );

    setPages(prev => {
      const next = new Map<number, Collection<T>[]>();
      for (const [key, items] of prev) {
        next.set(key, items
          .map(c => c.id === mergedCollection.id ? mergedCollection : c)
          .filter(c => !secondaryCollectionIds.includes(c.id)));
      }
      return next;
    });
  };

  return {
    collections,
    pageCollections,
    page,
    totalPages,
    loading,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    onGoToPage,
    onLoadMoreCollections,
    onRenameCollection,
    onMergeCollections
  };
};