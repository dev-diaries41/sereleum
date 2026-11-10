"use client";

import { useCallback } from "react";
import { Collection, CollectionId } from "@/app/types";
import { sereleumApiClient } from "../sereleum";
import { CollectionType } from "../enums/collections";
import { usePagination } from "./usePagination";

interface UseManageCollectionsOptions<T extends CollectionType = CollectionType> {
  type: T;
  initialCollections?: Collection<T>[];
  initialTotalCollections: number;
  pageSize?: number;
}

export const useManageCollections = <T extends CollectionType = CollectionType>({
  type,
  initialCollections = [],
  initialTotalCollections,
  pageSize = 25,
}: UseManageCollectionsOptions<T>) => {

  const fetchPage = useCallback(
    (offset: number, limit: number) =>
      sereleumApiClient.getCollections(type, offset, limit),
    [type]
  );

  const pagination = usePagination({
    initialItems: initialCollections,
    initialTotalItems: initialTotalCollections,
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


  const onDeleteCollections = async (collectionIds: CollectionId<T>[]) => {
    await sereleumApiClient.deleteCollection(type, collectionIds);
    pagination.setTotalItems(prev => Math.max(0, prev - collectionIds.length));
    pagination.invalidatePages();
  };

  const onMergeCollections = async ( primaryCollectionId: CollectionId<T>, secondaryCollectionIds: CollectionId<T>[] ) => {
      await sereleumApiClient.mergeCollections( type, primaryCollectionId, secondaryCollectionIds );
      pagination.setTotalItems(prev => Math.max(0, prev - secondaryCollectionIds.length));
      pagination.invalidatePages();
    };

  const onCreateCluster = async ( name: string, seed: string) => {
    const clusterId = await sereleumApiClient.createCluster( name, seed );
    pagination.setTotalItems(prev => Math.max(0, prev + 1));
    pagination.invalidatePages();
  };

  return {
    ...pagination,
    collections: pagination.items,
    pageCollections: pagination.pageItems,
    onLoadMoreCollections: pagination.onLoadMore,
    onRenameCollection,
    onMergeCollections,
    onDeleteCollections,
    onCreateCluster
  };
};