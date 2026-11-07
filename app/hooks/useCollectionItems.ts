"use client";

import { useCallback, useState } from "react";
import { Collection, CollectionId, DocItem } from "../types";
import { sereleumApiClient } from "../sereleum";
import { CollectionType } from "../enums/collections";
import { usePagination } from "./usePagination";

export const useCollectionItems = <T extends CollectionType = CollectionType>(
  collection: Collection<T>,
  initialItems: DocItem[] = [],
  pageSize: number = 25
) => {
  const [tags, setTags] = useState<string[]>([]);

  const fetchPage = useCallback(
    (offset: number, limit: number) =>
      sereleumApiClient.getItems(collection.type, [collection.id], limit, offset),
    [collection.id, collection.type]
  );

  const pagination = usePagination({
    initialItems,
    totalItems: collection.size,
    pageSize,
    fetchPage
  });

  const onMoveItems = async (
    itemIds: string[],
    newCollectionId: CollectionId<T>
  ) => {
    await sereleumApiClient.moveItems(itemIds, newCollectionId, collection.type);

    pagination.setPages(prev => {
      const next = new Map<number, DocItem[]>();

      for (const [key, items] of prev) {
        next.set(key, items.filter(item => !itemIds.includes(item.id)));
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
    ...pagination,
    onLoadMoreItems: pagination.onLoadMore,
    onMoveItems,
    onTagItems,
    tags,
    loadTags
  };
};