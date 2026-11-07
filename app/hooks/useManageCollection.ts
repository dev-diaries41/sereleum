'use client'
import { useState } from 'react';
import { Collection, CollectionId } from '@/app/types';
import { sereleumApiClient } from '../sereleum';
import { CollectionType } from '../enums/collections';

export const useManageCollections = <T extends CollectionType = CollectionType>(type: T, initialCollections: Collection<T>[] = [], totalCollections: number = 0) => {
    const [ collections, setCollections ] = useState<Collection<T>[]>(initialCollections);

    const onLoadMoreCollections = async(limit: number, offset: number) => {
        if(collections.length >= totalCollections) return
        const results =  await sereleumApiClient.getCollections(type, offset, limit)
        setCollections(prev => [...prev, ...results] )
    }

    const onRenameCollection = async(collectionId: CollectionId<T>, name: string) => {
        await sereleumApiClient.renameCollection(collectionId, name,type)
        setCollections((prev) => prev.map((c) => c.id === collectionId? {...c, name } : c ) );
    }

    const onMergeCollections = async(primaryCollectionId: CollectionId<T>, secondaryCollectionIds: CollectionId<T>[]) => {
        const mergedCollcetion = await sereleumApiClient.mergeCollections(type, primaryCollectionId, secondaryCollectionIds);
        setCollections(prev => prev.map(c => c.id === mergedCollcetion.id ? mergedCollcetion : c).filter(c => !secondaryCollectionIds.includes(c.id)))
    }

    return {
        collections,
        onMergeCollections,
        onLoadMoreCollections,
        onRenameCollection,
        };
};


