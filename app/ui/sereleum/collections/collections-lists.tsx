"use client";

import { useEffect, useMemo, useState } from "react";
import { Collection, CollectionId } from "@/app/types";
import { SortBySelector } from "../../common/sort-by";
import { CollectionType } from "@/app/enums/collections";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { useSelection } from "@/app/hooks/useSelection";
import { CollectionRow } from "./collection-row";
import { MergeCollectionsView } from "./merger";

const SortKeyOptions = ["size"] as const;
type SortKey = typeof SortKeyOptions[number];

interface CollectionsWrapperProps<T extends CollectionType> {
  type: T;
  totalCollections: number;
  pageSize?: number;
  initialCollections?: Collection<T>[];
}

export function CollectionsWrapper<T extends CollectionType = CollectionType>({
  pageSize = 25,
  initialCollections = [],
  type,
  totalCollections,
}: CollectionsWrapperProps<T>) {
  const { collections, onLoadMoreCollections, onMergeCollections } =
    useManageCollections<T>(type, initialCollections, totalCollections);

  const {
    selectedItems: selectedCollectionIds,
    isSelecting,
    toggleSelectedItem,
    toggleSelectionMode,
    clearSelection: clearSelectedItems,
    resetSelection,
  } = useSelection<CollectionId<T>>();

  const [isChoosingParent, setIsChoosingParent] = useState(false);
  const [parentCollectionId, setParentCollectionId] =useState<CollectionId<T> | null>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>("size");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  
  const isCluster = type === CollectionType.CLUSTER;
  const collectionLabel = isCluster ? "Clusters" : "Tags";

  const clearSelection = () => {
    clearSelectedItems();
    setParentCollectionId(null);
    setIsChoosingParent(false);
  };

  const reset = () => {
    resetSelection();
    setParentCollectionId(null);
    setIsChoosingParent(false);
  };

  const startChooseParent = () => {
    if (selectedCollectionIds.size === 0) return;

    setIsChoosingParent(true);
    setParentCollectionId((prev) => prev ?? [...selectedCollectionIds][0]);
  };

  const handleMergeCollectionsClick = () => {
    if (selectedCollectionIds.size === 0) return;
    startChooseParent();
  };

  const handleConfirmMerge = async () => {
    if (parentCollectionId === null) return;

    const secondaryCollectionIds = [...selectedCollectionIds].filter(
      (id) => id !== parentCollectionId
    );

    if (secondaryCollectionIds.length === 0) {
      reset();
      return;
    }

    try {
      await onMergeCollections(parentCollectionId, secondaryCollectionIds);
      reset();
    } catch (err) {
      console.error("Merge failed", err);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCollections / pageSize));
  const start = page * pageSize;
  const end = start + pageSize;

  const sortedCollections = useMemo(() => {
    const copy = [...collections];

    copy.sort((a, b) => {
      const av = a.size ?? 0;
      const bv = b.size ?? 0;

      if (av === bv) return 0;

      const result = av < bv ? -1 : 1;
      return sortDirection === "asc" ? result : -result;
    });

    return copy;
  }, [collections, sortDirection, sortBy]);

  const pageCollections = sortedCollections.slice(start, end);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(totalCollections / pageSize) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [totalCollections, pageSize, page]);

  const handleNext = () => {
    if (page + 1 < totalPages) {
      setPage((p) => p + 1);

      if (end >= collections.length) {
        onLoadMoreCollections(pageSize, collections.length);
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const selectedCollections = useMemo(
    () => collections.filter((c) => selectedCollectionIds.has(c.id)),
    [collections, selectedCollectionIds]
  );

  const labelFor = (key: SortKey) => {
    if (key === "size") return "Size";
    return "Default";
  };

  if (collections.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-8 text-center">
        No {collectionLabel.toLocaleLowerCase()} available
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8 px-2 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between mb-2 items-center">
        <h1 className="text-xl md:text-2xl">{collectionLabel}</h1>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              toggleSelectionMode();
              if (isSelecting) clearSelection();
            }}
            className="px-4 py-2 rounded-md text-sm border-2 font-medium border-indigo-600"
          >
            Manage {collectionLabel.toLocaleLowerCase()}
          </button>
        </div>
      </div>

      <SortBySelector
        options={SortKeyOptions}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        labelFor={labelFor}
      />

      {isSelecting && (
        <MergeCollectionsView<T>
          totalCollectionsCount={totalCollections}
          selectedCollections={selectedCollections}
          parentCollectionId={parentCollectionId}
          setParentCollectionId={setParentCollectionId}
          handleMergeCollectionsClick={handleMergeCollectionsClick}
          clearSelection={clearSelection}
          setIsSelecting={resetSelection}
          isChoosingParent={isChoosingParent}
          setIsChoosingParent={setIsChoosingParent}
          handleConfirmMerge={handleConfirmMerge}
        />
      )}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pageCollections.map((c) => (
          <CollectionRow
            key={c.id}
            collection={c}
            isSelecting={isSelecting}
            selected={selectedCollectionIds.has(c.id)}
            toggleSelection={() => toggleSelectedItem(c.id, totalCollections)}
          />
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-2 py-2">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
