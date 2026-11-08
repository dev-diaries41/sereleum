
"use client";

import { Collection } from "@/app/types";
import { CollectionType } from "@/app/enums/collections";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { CollectionRow } from "./collection-row";
import { useEffect } from "react";

interface CollectionPickerProps<T extends CollectionType> {
  type: T;
  totalCollections: number;
  pageSize?: number;
  initialCollections?: Collection<T>[];
  onPick: (collection: Collection<T>) => void;
}

export function CollectionPicker<T extends CollectionType = CollectionType>({
  type,
  totalCollections,
  pageSize = 25,
  initialCollections = [],
  onPick
}: CollectionPickerProps<T>) {
  const {
    totalItems,
    page,
    totalPages,
    pageCollections,
    loading,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    onLoadMoreCollections
  } = useManageCollections<T>({ type, initialCollections, initialTotalCollections: totalCollections, pageSize });

  const isCluster = type === CollectionType.CLUSTER;
  const collectionLabel = isCluster ? "Cluster" : "Tag";

    useEffect(() => {
    if (initialCollections.length === 0 && totalItems > 0) {
      onLoadMoreCollections(0);
    }
  }, [initialCollections.length, totalItems, onLoadMoreCollections]);


  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8 px-2 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between mb-2 items-center">
        <h1 className="text-xl md:text-2xl">Pick {collectionLabel}</h1>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pageCollections.map((c) => (
          <CollectionRow
            key={c.id}
            collection={c}
            onClick={() => onPick(c)}
          />
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onPrevPage}
          disabled={!hasPrevPage || loading}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-2 py-2">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={!hasNextPage || loading}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
