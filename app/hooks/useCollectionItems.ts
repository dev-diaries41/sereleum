
"use client";

import { useCallback, useMemo, useState } from "react";
import { Collection, CollectionId, DocItem } from "../types";
import { sereleumApiClient } from "../sereleum";
import { CollectionType } from "../enums/collections";

export const useCollectionItems = <T extends CollectionType = CollectionType>(
  collection: Collection<T>,
  initialItems: DocItem[] = [],
  pageSize: number = 25
) => {
  const [pages, setPages] = useState<Map<number, DocItem[]>>(
    () => initialItems.length > 0
      ? new Map([[0, initialItems]])
      : new Map()
  );
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const totalPages = Math.max(1, Math.ceil(collection.size / pageSize));
  const pageItems = pages.get(page) ?? [];
  const hasNextPage = page + 1 < totalPages;
  const hasPrevPage = page > 0;

  const items = useMemo(
    () => Array.from(pages.entries())
      .sort(([a], [b]) => a - b)
      .flatMap(([, items]) => items),
    [pages]
  );

  const onLoadMoreItems = useCallback(async (targetPage: number) => {
    if (
      targetPage < 0 ||
      targetPage >= totalPages ||
      pages.has(targetPage)
    ) return;

    setLoading(true);

    try {
      const result = await sereleumApiClient.getItems(
        collection.type,
        [collection.id],
        pageSize,
        targetPage * pageSize
      );

      setPages(prev => {
        if (prev.has(targetPage)) return prev;

        const next = new Map(prev);
        next.set(targetPage, result);
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [collection.id, collection.type, pageSize, totalPages, pages]);

  const onGoToPage = useCallback(async (targetPage: number) => {
    if (targetPage < 0 || targetPage >= totalPages) return;

    await onLoadMoreItems(targetPage);
    setPage(targetPage);
  }, [totalPages, onLoadMoreItems]);

  const onNextPage = () => hasNextPage && onGoToPage(page + 1);
  const onPrevPage = () => hasPrevPage && setPage(page - 1);

  const onMoveItems = async (
    itemIds: string[],
    newCollectionId: CollectionId<T>
  ) => {
    await sereleumApiClient.moveItems(
      itemIds,
      newCollectionId,
      collection.type
    );

    setPages(prev => {
      const next = new Map<number, DocItem[]>();

      for (const [key, pageItems] of prev) {
        next.set(
          key,
          pageItems.filter(item => !itemIds.includes(item.id))
        );
      }

      return next;
    });
  };

  const onTagItems = async (tag: string, itemIds: string[]) => {
    await sereleumApiClient.tagItems(tag, itemIds);
  };

  const loadTags = async () => {
    if (tags.length > 0) return;

    const fetchedTags = (
      await sereleumApiClient.getCollections(CollectionType.TAG)
    ).map(t => t.name);

    setTags(fetchedTags);
  };

  return {
    items,
    pageItems,
    page,
    totalPages,
    loading,
    hasNextPage,
    hasPrevPage,
    tags,
    onNextPage,
    onPrevPage,
    onGoToPage,
    onLoadMoreItems,
    onMoveItems,
    onTagItems,
    loadTags
  };
};
