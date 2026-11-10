'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemsTable from "../items-table";
import { ActionConfig, Collection, DocItem } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faFolder, faLinkSlash, faPen, faTag, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { useSelection } from "@/app/hooks/useSelection";
import { CollectionType } from "@/app/enums/collections";
import { SelectionControls } from "@/app/ui/common/selection-controls";
import { ActionsMenu } from "@/app/ui/common/action-menu";
import { FloatingActionButton } from "@/app/ui/common/fab";
import { useCollectionItems } from "@/app/hooks/useCollectionItems";
import { TagAdder } from "@/app/ui/sereleum/tags/tag-adder";
import { Modal } from "@/app/ui/modals/modal";
import { CollectionPicker } from "./collection-picker";
import { ConfirmationModal } from "@/app/ui/modals/confirm-modal";
import { SereleumErrorCode } from "@/app/sereleum/errors";

interface CollectionManagerProps<T extends CollectionType> {
  initialItems?: DocItem[];
  initialTotalCollections: number;
  collectionToView: Collection<T>;
  type: T;
  pageSize?: number;
}

export function CollectionManagerView<T extends CollectionType>({
  initialTotalCollections,
  collectionToView,
  type,
  initialItems = [],
  pageSize = 25,
}: CollectionManagerProps<T>) {
  const router = useRouter();

  const [collection, setCollection] = useState<Collection<T>>(collectionToView);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [isUnTagging, setIsUnTagging] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const { onRenameCollection } = useManageCollections<T>({type, initialTotalCollections});
  const {
  totalItems,
  pageItems,
  page,
  totalPages,
  loading,
  hasNextPage,
  hasPrevPage,
  tags,
  onNextPage,
  onPrevPage,
  onMoveClusterItems,
  onTagItems,
  onUnTagItems,
  loadTags
} = useCollectionItems<T>({collection, initialItems, pageSize});
  const { isSelecting, selectedCount, selectedItems, excludedItems, selectAll, resetSelection, setSelectAll, toggleSelectedItem, toggleSelectionMode, clearSelection, isItemSelected } = useSelection<string>();

  const isCluster = type === CollectionType.CLUSTER;
  const collectionLabel = isCluster ? 'cluster' : 'tag';
  const collectionName = collection?.name && collection.name !== collection.id ? collection.name : 'Unknown collection';   // collection.name defaults to id


  useEffect(() => {
    if(!isTagging) return 
    loadTags()
  }, [isTagging])


  useEffect(() => {
    if(!collection) return
    setName(collectionName);
  }, [collection]);


  const actions: ActionConfig[] = [
    {
      enabled: selectedCount > 0,
      label: "Add tag",
      icon: faTag,
      onClick: () => {
        setActionsOpen(false);
        setIsTagging(true);
      }
    },
    {
      hideIfDisabled: true,
      enabled: selectedCount > 0 && collection.type === CollectionType.TAG,
      label: "Remove tag",
      icon: faLinkSlash,
      onClick: () => {
        setActionsOpen(false);
        setIsUnTagging(true);
      }
    },
    {
      hideIfDisabled: true,
      enabled: selectedCount > 0 && collection.type === CollectionType.CLUSTER,
      label: "Move",
      icon: faFolder,
      onClick: () => {
        setActionsOpen(false);
        setIsMoving(true);
      }
    },
  ];

  const handleRowClick = (item: DocItem) => {
    if (!isSelecting) return;
    toggleSelectedItem(item.id, totalItems);
  };

  const handleDone = () => {
    clearSelection();
    toggleSelectionMode();
  };

  const renameCollection = async () => {
    if (!name.trim() || name.trim() === collection.name.trim()) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onRenameCollection(collection.id, name.trim());
      setCollection(prev => prev ? { ...prev, name: name.trim() } : prev);
      setEditing(false);
    }catch(error){
      if (error instanceof Error) {
        try {
          const detail = JSON.parse(error.message);
          if (detail.detail?.code === SereleumErrorCode.DUPLICATE_NAME) {
            alert(detail.detail.message);
          }
        } catch {
            console.error("Renaming collcetion failed", error);
            alert('Unknown error renaming collection');
        }
      }
    }
    finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setName(collection.name);
    setEditing(false);
  };


  const tagItems = async (tag: string) => {
    try {
      await onTagItems(tag, Array.from(selectedItems), Array.from(excludedItems), selectAll);
      setIsTagging(false);
      resetSelection()
    } catch(e){
      console.error(e)
    }
  };


  const unTagItems = async () => {
    try {
      await onUnTagItems(collection.id as number, Array.from(selectedItems), Array.from(excludedItems), selectAll, selectedCount);
      setIsUnTagging(false);
      resetSelection()
    } catch(e){
      console.error(e)
    }
  };


  const moveClusterItems = async (destinationCollcetion: Collection<T>) => {
    try {
      await onMoveClusterItems(destinationCollcetion.id as string, collection.id as string, Array.from(selectedItems), Array.from(excludedItems), selectAll, selectedCount);
      setIsMoving(false);
      resetSelection()
    } catch(e){
      console.error(e)
    }
  };


  return (
    <div className="w-full mx-auto">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <button
            onClick={() => router.push(isCluster ? '/dashboard/clusters' : '/dashboard/tags')}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to all {collectionLabel}s
          </button>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') renameCollection();
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    className="text-2xl md:text-3xl font-normal border-b-2 border-indigo-500 bg-transparent outline-none min-w-0 w-full"
                  />
                  <button
                    onClick={renameCollection}
                    disabled={saving || !name.trim()}
                    className="text-green-600 hover:text-green-700 disabled:opacity-50"
                    title="Save name"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="text-gray-400 hover:text-gray-600"
                    title="Cancel editing"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl">
                    {collectionName}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                    title={`Edit ${collectionLabel} name`}
                  >
                    <FontAwesomeIcon icon={faPen} size="sm" />
                  </button>
                </>
              )}
            </div>
            <h3 className="text-sm md:text-md text-gray-500">id: {collection.id}</h3>
          </div>
        </div>

        <SelectionControls
          label="Manage items"
          isSelecting={isSelecting}
          selectedCount={selectedCount}
          totalCount={totalItems}
          onSelect={toggleSelectionMode}
          onSelectAllChange={checked => setSelectAll(checked, totalItems)}
          onClearSelection={clearSelection}
          onDone={handleDone}
        />

        <ItemsTable
          items={pageItems}
          collection={collection}
          title={`${totalItems} Items`}
          isSelecting={isSelecting}
          isSelected={isItemSelected}
          onRowClick={handleRowClick}
          page={page}
          totalPages={totalPages}
          loading={loading}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
        />
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {actionsOpen && <ActionsMenu actions={actions} />}
        {isSelecting &&  <FloatingActionButton
          isOpen={actionsOpen}
          onClick={() => setActionsOpen(open => !open)}
        />}
      </div>
      <TagAdder
        tags = {tags}
        isVisible ={isTagging}
        onClose ={()=> setIsTagging(false)}
        onAddTag ={tagItems}
      />

      <Modal isOpen={isMoving} onClose={() => setIsMoving(false)}>
        <CollectionPicker
        type={type}
        totalCollections={initialTotalCollections}
        onPick={moveClusterItems}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isUnTagging}
        onClose={() => setIsUnTagging(false)}
        onConfirm={unTagItems}
        title="Remove tag"
        message={`Are you sure you want to remove '${collection.name}' tag from ${selectedCount} items?`}
        />
    </div>
  );
}