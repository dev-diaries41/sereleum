"use client";

import  { useEffect, useMemo, useState } from "react";
import { Collection, CollectionId } from "@/app/types";
import { SortBySelector } from "../../common/sort-by";
import { CollectionType } from "@/app/enums/collections";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { CollectionRow } from "./collection-row";
import { MergeCollectionsView } from "./merger";

const SortKeyOptions = ['size'] as const;
type SortKey = typeof SortKeyOptions[number];


interface CollectionsWrapperProps<T extends CollectionType> {
  type: T,
  totalCollections: number;
  pageSize?: number;
  initialCollections?: Collection<T>[]
  
}

export function CollectionsWrapper<T extends CollectionType = CollectionType>({ 
  pageSize = 25, 
  initialCollections = [],
  type,
  totalCollections
 }: CollectionsWrapperProps<T>) {

  const { collections, onLoadMoreCollections , onMergeCollections} = useManageCollections<T>(type, initialCollections, totalCollections);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<CollectionId<T>[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isChoosingParent, setIsChoosingParent] = useState(false);
  const [parentCollectionId, setParentCollectionId] = useState<CollectionId<T> | null>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>('size');
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  

  const isCluster = type === CollectionType.CLUSTER
  const collectonLabel = isCluster? 'Clusters' : 'Tags'

  const toggleSelection = (id: CollectionId<T>) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedCollectionIds([]);
    setParentCollectionId(null);
    setIsChoosingParent(false);
  };

  const reset = () => {
    clearSelection();
    setIsSelecting(false);
  }

  const startChooseParent = () => {
    if (selectedCollectionIds.length === 0) return;
    setIsChoosingParent(true);
    setParentCollectionId((prev) => prev ?? selectedCollectionIds[0]);
  };

  const handleConfirmMerge = async () => {
    if (!parentCollectionId) return;

    const secondaryCollectionIds = selectedCollectionIds.filter(
      (id) => id !== parentCollectionId
    );

    if (secondaryCollectionIds.length === 0) {
      reset()
      return;
    }

    try {
      await onMergeCollections(parentCollectionId, secondaryCollectionIds);
      reset()
    } catch (err) {
      console.error("Merge failed", err);
    } 
  };


  const handleMergeCollectionsClick = () => {
    if (selectedCollectionIds.length === 0) return;
    startChooseParent();
  };

  const totalPages = Math.max(1, Math.ceil(totalCollections / pageSize));
  const start = page * pageSize;
  const end = start + pageSize;

  // Compute sorted collections (keeps core logic intact; sorting happens before pagination)
  const sortedCollections = useMemo(() => {
    if (!sortBy) return collections;
    const copy = [...collections];
    copy.sort((a, b) => {
      let av: number = 0;
      let bv: number = 0;
      switch (sortBy) {
        case "size":
          av = a.size ?? 0;
          bv = b.size ?? 0;
          break;
      }

      if (av === bv) return 0;
      const res = av < bv ? -1 : 1;
      return sortDirection === "asc" ? res : -res;
    });
    return copy;
  }, [collections, sortBy, sortDirection]);

  const pageCollections = sortedCollections.slice(start, end);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(totalCollections / pageSize) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [totalCollections, pageSize, page]);

  const handleNext = () => {
    if (page + 1 < totalPages) {
      setPage((p) => p + 1);
      const needMore = end >= collections.length;
      if (needMore) {
        onLoadMoreCollections(pageSize, collections.length);
      }
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  if (collections.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-8 text-center">No {collectonLabel.toLocaleLowerCase()} available</div>
    );
  }

  const selectedCollections = selectedCollectionIds
    .map((id) => collections.find((c) => c.id === id))
    .filter(Boolean) as Collection<T>[];

  const labelFor = (k: SortKey) => {
    if (k === 'size') return ' Size';
    return 'Default';
  }

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8 px-2 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between mb-2 items-center">
        <h1 className="text-xl md:text-2xl">{collectonLabel}</h1>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setIsSelecting((s) => !s);
              if (isSelecting) clearSelection();
            }}
            className={`px-4 py-2 rounded-md text-sm border-2 font-medium border-indigo-600`}
          >
           Manage {collectonLabel.toLocaleLowerCase()}
          </button>
        </div>
      </div>

      <SortBySelector
        options = {SortKeyOptions}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        labelFor={labelFor}
      />

    {isSelecting && (
          <MergeCollectionsView<T>
            selectedCollectionIds={selectedCollectionIds}
            totalCollectionsCount={totalCollections}
            selectedCollections={selectedCollections}
            parentCollectionId={parentCollectionId}
            setParentCollectionId={setParentCollectionId}
            handleMergeCollectionsClick={handleMergeCollectionsClick}
            clearSelection={clearSelection}
            setIsSelecting={setIsSelecting}
            isChoosingParent={isChoosingParent}
            setIsChoosingParent={setIsChoosingParent}
            handleConfirmMerge={handleConfirmMerge}
          />
        )}

        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pageCollections.map((c) => (
          <CollectionRow
            key={c.id}
            collection={c}
            isSelecting={isSelecting}
            selected={selectedCollectionIds.includes(c.id)}
            toggleSelection={() => toggleSelection(c.id)}
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
        <span className="px-2 py-2">Page {page + 1} of {totalPages || 1}</span>
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
