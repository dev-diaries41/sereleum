'use client';

import { useRouter } from "next/navigation";
import {  useEffect, useLayoutEffect, useState } from "react";
import ItemsTable from "../items-table";
import { CollectionNameForm } from "./collection-name-form";
import {  Collection, CollectionId } from "@/app/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useManageCollections } from "@/app/hooks/useManageCollection";
import { CollectionType } from "@/app/enums/collections";
import { capitalizeFirstLetter } from "@/app/lib/helpers";

interface CollectionManagerProps<T extends CollectionType> { 
  id?: CollectionId<T>;
  type: T
}


export function CollectionManagerView<T extends CollectionType>({ 
  id,
  type
}: CollectionManagerProps<T>) {
  const router = useRouter();

  const [collection, setCollection] = useState<Collection<T> | null>(null);
  const {onRenameCollection, onGetCollection} = useManageCollections<T>(type);
  const [labelDraft, setLabelDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const isCluster = type === CollectionType.CLUSTER
  const collectionLabel = isCluster? 'cluster' : 'tag'

  if (id === undefined){
    if(isCluster){
      router.push('/dashboard/clusters')
    }else{
      router.push('/dashboard/tags')
    }
  }
      
  useLayoutEffect(() => {
    if(!id) return 
    onGetCollection(id).then(c => setCollection(c))
  }, [id])

   useEffect(() => {
    if(!collection) return 
    setLabelDraft(collection.name);
  }, [collection]);


  if(!collection) return <div className="mx-auto">{capitalizeFirstLetter(collectionLabel)} not found</div>  
 
  const renameCluster = async () => {
    setSaving(true);
    try {
      await onRenameCollection(collection.id, labelDraft);
      setCollection(prev => prev? {...prev, name: labelDraft} : prev)
    } finally {
      setSaving(false);
    }
  };

return (
    <div className="mx-auto">
      <div className="p-8 max-w-full">
        <div className="flex items-start justify-between mb-6">
          <button
            onClick={() => router.push('/dashboard/clusters')}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to all {collectionLabel}s
          </button>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl"> {collection.name !== id? collection.name : 'Unknown collection'} </h2>
            <h3 className="text-sm md:text-md text-gray-500"> id: {id} </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CollectionNameForm
            collection={collection}
            nameDraft={labelDraft}
            enabled={saving}
            onLabelDraftChange={(e) => setLabelDraft(e.target.value)}
            onSaveLabel={renameCluster}
          />
        </div>
        <ItemsTable collection={collection} />
      </div>
  </div>
);

}