'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemsTable from "../items-table";
import { ActionConfig, Collection, DocItem } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faFolder, faPen, faTag, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { useSelection } from "@/app/hooks/useSelection";
import { CollectionType } from "@/app/enums/collections";
import { SelectionControls } from "../../common/selection-controls";
import { ActionsMenu } from "../../common/action-menu";
import { FloatingActionButton } from "../../common/fab";
import { useCollectionItems } from "@/app/hooks/useCollectionItems";
import { TagAdder } from "../tags/tag-adder";

interface CollectionManagerProps<T extends CollectionType> {
  initialItems?: DocItem[];
  collectionToView: Collection<T>;
  type: T;
  pageSize?: number;
}

export function CollectionManagerView<T extends CollectionType>({
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
  const [isTagging, setIsTagging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const { onRenameCollection } = useManageCollections<T>(type);
  const { items, tags, onLoadMoreItems, onTagItems, loadTags } = useCollectionItems<T>(collection, initialItems);
  const { isSelecting, selectedCount, selectedItems,  resetSelection, setSelectAll, toggleSelectedItem, toggleSelectionMode, clearSelection, isItemSelected, getSelectedItems } = useSelection<string>();

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
      enabled: selectedCount > 0,
      label: "Move",
      icon: faFolder,
      onClick: () => {
        setActionsOpen(false);
        setIsMoving(true);
        // TODO: Implement Move
      }
    },
    {
      enabled: selectedCount > 0,
      label: "Delete",
      icon: faTrash,
      onClick: () => {
        setActionsOpen(false);
        // TODO: Implement Delete
      }
    }
  ];

  const handleRowClick = (item: DocItem) => {
    if (!isSelecting) return;
    toggleSelectedItem(item.id, collection.size);
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
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setName(collection.name);
    setEditing(false);
  };


  const tagItems = async (tag: string) => {
    try {
      // TODO: make api accept include and exclude ids
      await onTagItems(tag, Array.from(selectedItems));
      setIsTagging(false);
      resetSelection()
    } catch(e){
      console.error(e)
    }
  };


  return (
    <div className="mx-auto">
      <div className="p-8 max-w-full">
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
          isSelecting={isSelecting}
          selectedCount={selectedCount}
          totalCount={collection.size}
          onSelect={toggleSelectionMode}
          onSelectAllChange={checked => setSelectAll(checked, collection.size)}
          onClearSelection={clearSelection}
          onDone={handleDone}
        />

        <ItemsTable
          items = {items}
          collection={collection}
          title={`${collection.size} Items`}
          isSelecting={isSelecting}
          isSelected={isItemSelected}
          onRowClick={handleRowClick}
          onLoadMoreItems={onLoadMoreItems}
          pageSize={pageSize}
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
    </div>
  );
}