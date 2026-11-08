"use client";

import { useCallback, useState } from "react";
import { Collection, CollectionId, DocItem } from "../types";
import { sereleumApiClient } from "../sereleum";
import { CollectionType } from "../enums/collections";
import { usePagination } from "./usePagination";

interface UseCollectionItemsOptions<T extends CollectionType = CollectionType> {
  collection: Collection<T>;
  initialItems?: DocItem[];
  pageSize?: number;
}

export const useCollectionItems = <T extends CollectionType = CollectionType>({
  collection,
  initialItems = [],
  pageSize = 25,
}: UseCollectionItemsOptions<T>) => {
  const [tags, setTags] = useState<string[]>([]);

  const fetchPage = useCallback(
    (offset: number, limit: number) =>
      sereleumApiClient.getItems(collection.type, [collection.id], limit, offset),
    [collection.id, collection.type]
  );

  const pagination = usePagination({
    initialItems,
    initialTotalItems: collection.size,
    pageSize,
    fetchPage
  });

  const onMoveClusterItems = async ( destinationCollection: string, sourceCollection: string, itemIds: string[], excludedItemIds: string[], selectAll: boolean  ) => {
    await sereleumApiClient.moveClusterItems(destinationCollection, sourceCollection, itemIds, excludedItemIds, selectAll);
    pagination.setTotalItems(prev => Math.max(0, prev - itemIds.length));
    await pagination.invalidatePages();
  };

  const onTagItems = async (tag: string, itemIds: string[], excludedItemIds: string[], selectAll: boolean) => {
    await sereleumApiClient.tagItems(tag, collection.id, itemIds, excludedItemIds, selectAll);
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
    onMoveClusterItems,
    onTagItems,
    tags,
    loadTags
  };
};