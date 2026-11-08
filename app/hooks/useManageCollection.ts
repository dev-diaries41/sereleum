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
    initialTotalItems: totalCollections,
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