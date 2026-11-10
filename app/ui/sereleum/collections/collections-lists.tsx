
"use client";

import { useMemo, useState } from "react";
import { ActionConfig, Collection, CollectionId } from "@/app/types";
import { CollectionType } from "@/app/enums/collections";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { useSelection } from "@/app/hooks/useSelection";
import { CollectionRow } from "./collection-row";
import { SelectionControls } from "../../common/selection-controls";
import { FloatingActionButton } from "../../common/fab";
import { ActionsMenu } from "../../common/action-menu";
import { faChevronDown, faChevronUp, faCodeMerge, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Selector } from "../../common/selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectorModal } from "@/app/ui/modals/selector-modal";
import { viewCollection } from "@/app/lib/nav";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "@/app/ui/modals/delete-modal";
import { CreateClusterModal } from "./create-cluster-modal";
import { SereleumErrorCode } from "@/app/sereleum/errors";

const SortKeyOptions = ["size"] as const;
type SortKey = typeof SortKeyOptions[number];

const sortOptions: [string, SortKey][] = [
  ["Size", "size"],
];

interface CollectionsWrapperProps<T extends CollectionType> {
  type: T;
  initialTotalCollections: number;
  pageSize?: number;
  initialCollections?: Collection<T>[];
}

export function CollectionsWrapper<T extends CollectionType = CollectionType>({
  pageSize = 25,
  initialCollections = [],
  type,
  initialTotalCollections,
}: CollectionsWrapperProps<T>) {
  const router = useRouter();

  const {
    totalItems: totalCollections,
    collections,
    page,
    totalPages,
    pageCollections,
    loading,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    onMergeCollections,
    onDeleteCollections,
    onCreateCluster
  } = useManageCollections<T>({type, initialCollections, initialTotalCollections, pageSize});

  const {
    selectedCount,
    selectedItems: selectedCollectionIds,
    isSelecting,
    toggleSelectedItem,
    toggleSelectionMode,
    setSelectAll,
    clearSelection: clearSelectedItems,
    resetSelection,
    isItemSelected
  } = useSelection<CollectionId<T>>();

  const [isCreatingCluster, setIsCreatingCluster] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("size");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [actionsOpen, setActionsOpen] = useState(false);

  const isCluster = type === CollectionType.CLUSTER;
  const collectionLabel = isCluster ? "Clusters" : "Tags";

  const actions: ActionConfig[] = [
    {
      enabled: selectedCount > 1,
      label: "Merge",
      icon: faCodeMerge,
      onClick: () => {
        setActionsOpen(false);
        setIsMerging(true);
      }
    },
    {
      enabled: selectedCount > 0,
      label: "Delete",
      icon: faTrash,
      onClick: () => {
        setActionsOpen(false);
        setIsDeleting(true)
      }
    }
  ];

  const clearSelection = () => {
    clearSelectedItems();
    setIsMerging(false);
  };

  const handleConfirmMerge = async (parentCollectionId: CollectionId<T>) => {
    const secondaryCollectionIds = [...selectedCollectionIds].filter(
      id => id !== parentCollectionId
    );

    try {
      await onMergeCollections(parentCollectionId, secondaryCollectionIds);
      setIsMerging(false);
      resetSelection()
    } catch (err) {
      console.error("Merge failed", err);
      alert('Unknown error merging collections');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await onDeleteCollections([...selectedCollectionIds]);
      setIsDeleting(false);
      resetSelection();
    } catch (err) {
      console.error("Delete failed", err);
      alert('Unknown error deleting collections');
    }
  };

  const handleCreateCluster = async (name: string, seed: string) => {
    try {
      await onCreateCluster(name, seed);
      setIsCreatingCluster(false);
    } catch (error) {

      if (error instanceof Error) {
        try {
          const detail = JSON.parse(error.message);
          if (detail.detail?.code === SereleumErrorCode.DUPLICATE_NAME) {
            alert(detail.detail.message);
          }
        } catch {
            console.error("Creating cluster failed", error);
            alert('Unknown error creating cluster');
        }
      }
    }
  };

  const handleCollectionClick = (collection: Collection<T>) => {
    if (isSelecting) {
      toggleSelectedItem(collection.id, totalCollections);
    } else {
      viewCollection(router, collection);
    }
  };

  const selectedCollections = useMemo(
    () => collections.filter(c => selectedCollectionIds.has(c.id)),
    [collections, selectedCollectionIds]
  );

  const collectionOptions: [string, CollectionId<T>][] =
    selectedCollections.map(c => [c.name, c.id]);

  if (collections.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-2 gap-4">
      <h1 className="text-xl md:text-2xl">
        {totalCollections} {collectionLabel}
      </h1>

      {!isSelecting && isCluster && (
        <button
          onClick={() => setIsCreatingCluster(true)}
          className="px-4 py-2 border rounded"
        >
          Create Cluster
        </button>
      )}

      <div className="text-sm text-gray-500 py-8 text-center">
        No {collectionLabel.toLocaleLowerCase()} available
      </div>

      <CreateClusterModal
        isVisible={isCreatingCluster}
        onClose={() => setIsCreatingCluster(false)}
        onCreateCluster={handleCreateCluster}
      />
    </div>
  );
}

  return (
    <div className="flex flex-col mx-auto w-full items-center justify-center py-8 px-2 gap-4">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between mb-2 items-center">
        <h1 className="text-xl md:text-2xl">{totalCollections} {collectionLabel}</h1>
          <div className="flex items-center gap-3">
            <SelectionControls
                allowSelectAll={false}
                label={`Manage ${collectionLabel}`}
                isSelecting={isSelecting}
                selectedCount={selectedCount}
                totalCount={totalCollections}
                onSelect={toggleSelectionMode}
                onSelectAllChange={checked => setSelectAll(checked, totalCollections)}
                onClearSelection={clearSelection}
                onDone={() => resetSelection()}
              />
              {!isSelecting && isCluster && (
                <button
                  onClick={() => setIsCreatingCluster(true)}
                  className="px-4 py-2 border rounded"
                >
                  Create Cluster
                </button>
              )}
          </div>

  
      </div>

      <Selector
        label="Sort by:"
        options={sortOptions}
        selectedOption={sortBy}
        onSelect={value => setSortBy(value)}
      >
        <button
          onClick={e => {
            e.stopPropagation();
            setSortDirection(d => d === "desc" ? "asc" : "desc");
          }}
          className="ml-2 text-gray-400 text-xs"
        >
          <FontAwesomeIcon icon={sortDirection === "desc" ? faChevronDown : faChevronUp} />
        </button>
      </Selector>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pageCollections.map(c => (
          <CollectionRow
            key={c.id}
            collection={c}
            isSelecting={isSelecting}
            selected={isItemSelected(c.id)}
            onClick={() => handleCollectionClick(c)}
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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {actionsOpen && <ActionsMenu actions={actions} />}
        <FloatingActionButton
          isOpen={actionsOpen}
          onClick={() => setActionsOpen(open => !open)}
        />
      </div>

      <SelectorModal
        label="Primary collection"
        options={collectionOptions}
        isVisible={isMerging}
        title="Select primary collection"
        onClose={() => setIsMerging(false)}
        onConfirm={handleConfirmMerge}
      />
      <DeleteConfirmationModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleConfirmDelete}
        itemCount={selectedCount}
        itemLabel={isCluster ? "clusters" : "tags"}
        loading={loading}
      />
      <CreateClusterModal
        isVisible={isCreatingCluster}
        onClose={()=> setIsCreatingCluster(false)}
        onCreateCluster={handleCreateCluster}
      />
    </div>
  );
}
