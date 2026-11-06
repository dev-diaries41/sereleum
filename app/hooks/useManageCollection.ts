'use client'
import { useState } from 'react';
import { Collection, CollectionId } from '@/app/types';
import { apiPromptsClient } from '../sereleum';
import { CollectionType } from '../enums/collections';

export const useManageCollections = <T extends CollectionType = CollectionType>(type: T, initialCollections: Collection<T>[] = [], totalCollections: number = 0) => {
    const [ collections, setCollections ] = useState<Collection<T>[]>(initialCollections);

    const onGetCollection = async(collectionId: CollectionId<T>): Promise<Collection<T>> => {
        const clusters =  await apiPromptsClient.getCollections(type, 0, 1, collectionId)
        return clusters[0]
    }

    const onLoadMoreCollections = async(limit: number, offset: number) => {
        if(collections.length >= totalCollections) return
        const results =  await apiPromptsClient.getCollections(type, offset, limit)
        setCollections(prev => [...prev, ...results] )
    }

    const onRenameCollection = async(collectionId: CollectionId<T>, name: string) => {
        await apiPromptsClient.renameCollection(collectionId, name,type)
        setCollections((prev) => prev.map((c) => c.id === collectionId? {...c, name } : c ) );
    }

    const onMergeCollections = async(primaryCollectionId: CollectionId<T>, secondaryCollectionIds: CollectionId<T>[]) => {
        const mergedCollcetion = await apiPromptsClient.mergeCollections(type, primaryCollectionId, secondaryCollectionIds);
        const id = collections[0].id
        setCollections(prev => prev.map(c => c.id === mergedCollcetion.id ? mergedCollcetion : c).filter(c => !secondaryCollectionIds.includes(c.id)))
    }

    return {
        collections,
        onMergeCollections,
        onLoadMoreCollections,
        onGetCollection,
        onRenameCollection,
        };
};


