'use client';

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import ItemsTable from "../items-table";
import { Collection, CollectionId, DocItem } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { useSelection } from "@/app/hooks/useSelection";
import { CollectionType } from "@/app/enums/collections";
import { capitalizeFirstLetter } from "@/app/lib/helpers";
import { SelectionControls } from "../../common/selection-controls";

interface CollectionManagerProps<T extends CollectionType> {
  id?: CollectionId<T>;
  type: T;
}

export function CollectionManagerView<T extends CollectionType>({
  id,
  type
}: CollectionManagerProps<T>) {
  const router = useRouter();
  const [collection, setCollection] = useState<Collection<T> | null>(null);
  const { onRenameCollection, onGetCollection } = useManageCollections<T>(type);
  const [labelDraft, setLabelDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);


  const {
    selectedItems,
    excludedItems,
    selectAll,
    isSelecting,
    selectedCount,
    setSelectAll,
    toggleSelectedItem,
    toggleSelectionMode,
    clearSelection
  } = useSelection<DocItem>();

  const isCluster = type === CollectionType.CLUSTER;
  const collectionLabel = isCluster ? 'cluster' : 'tag';

  useLayoutEffect(() => {
    if (!id) {
      router.push(isCluster ? '/dashboard/clusters' : '/dashboard/tags');
      return;
    }
    onGetCollection(id).then(c => setCollection(c));
  }, [id]);



  if (!collection) {
    return <div className="mx-auto">{capitalizeFirstLetter(collectionLabel)} not found</div>;
  }

  // collection.name defaults to id
  const collectionName = collection?.name !== id ? collection?.name : 'Unknown collection' 


  useEffect(() => {
    setLabelDraft(collection.name !== id ? collection.name : 'Unknown collection');
  }, [collection, id]);

  const handleRowClick = (item: DocItem) => {
    if (!isSelecting) return;
    toggleSelectedItem(item, collection.size);
  };

  const isItemSelected = (item: DocItem) =>
    selectedItems.has(item) || (selectAll && !excludedItems.has(item));

  const handleDone = () => {
    clearSelection();
    toggleSelectionMode();
  };

  const renameCollection = async () => {
    if (!labelDraft.trim() || labelDraft.trim() === collection.name.trim()) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onRenameCollection(collection.id, labelDraft.trim());
      setCollection(prev => prev ? { ...prev, name: labelDraft.trim() } : prev);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setLabelDraft(collection.name);
    setEditing(false);
  };

  if (!collection) {
    return <div className="mx-auto">{capitalizeFirstLetter(collectionLabel)} not found</div>;
  }

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
                    value={labelDraft}
                    onChange={e => setLabelDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') renameCollection();
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    className="text-2xl md:text-3xl font-normal border-b-2 border-indigo-500 bg-transparent outline-none min-w-0 w-full"
                  />
                  <button
                    onClick={renameCollection}
                    disabled={saving || !labelDraft.trim()}
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
            <h3 className="text-sm md:text-md text-gray-500">id: {id}</h3>
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
          collection={collection}
          title={`${collection.size} Items`}
          isSelecting={isSelecting}
          isSelected={isItemSelected}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}
