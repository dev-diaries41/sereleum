"use client";

import { useCallback } from "react";
import { Collection, CollectionId } from "@/app/types";
import { sereleumApiClient } from "../sereleum";
import { CollectionType } from "../enums/collections";
import { usePagination } from "./usePagination";

export const useManageCollections = <T extends CollectionType = CollectionType>(
  type: T,
  initialCollections: Collection<T>[] = [],
  totalCollections: number,
  pageSize: number = 25
) => {
  const fetchPage = useCallback(
    (offset: number, limit: number) =>
      sereleumApiClient.getCollections(type, offset, limit),
    [type]
  );

  const pagination = usePagination({
    initialItems: initialCollections,
    totalItems: totalCollections,
    pageSize,
    fetchPage
  });

  const onRenameCollection = async ( collectionId: CollectionId<T>, name: string ) => {
    await sereleumApiClient.renameCollection(collectionId, name, type);

    pagination.setPages(prev => {
      const next = new Map(prev);

      for (const [key, items] of next) {
        next.set(
          key,
          items.map(c => c.id === collectionId ? { ...c, name } : c)
        );
      }

      return next;
    });
  };

  const onDeleteCollections = async ( collectionIds: CollectionId<T>[]) => {
    await sereleumApiClient.deleteCollection(type, collectionIds);

    pagination.setPages(prev => {
      const next = new Map(prev);

      for (const [key, items] of next) {
        next.set(
          key,
          items.filter(c => !collectionIds.includes(c.id))
        );
      }

      return next;
    });
  };

  const onMergeCollections = async ( primaryCollectionId: CollectionId<T>, secondaryCollectionIds: CollectionId<T>[] ) => {
    const mergedCollection = await sereleumApiClient.mergeCollections(
      type,
      primaryCollectionId,
      secondaryCollectionIds
    );

    pagination.setPages(prev => {
      const next = new Map<number, Collection<T>[]>();

      for (const [key, items] of prev) {
        next.set(
          key,
          items
            .map(c => c.id === mergedCollection.id ? mergedCollection : c)
            .filter(c => !secondaryCollectionIds.includes(c.id))
        );
      }

      return next;
    });
  };

  return {
    ...pagination,
    collections: pagination.items,
    pageCollections: pagination.pageItems,
    onLoadMoreCollections: pagination.onLoadMore,
    onRenameCollection,
    onMergeCollections,
    onDeleteCollections
  };
};