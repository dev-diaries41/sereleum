'use client'

import { useState } from "react";
import { Collection, CollectionId, DocItem } from "../types";
import { sereleumApiClient } from "../sereleum";
import { CollectionType } from "../enums/collections";

export const useCollectionItems = <T extends CollectionType = CollectionType>(collection: Collection<T>, initialItems: DocItem[] = []) => {
    const [ items, setItems ] = useState<DocItem[]>(initialItems);
    const [ tags, setTags ] = useState<string[]>([]);
    
    const onMoveItems = async(itemIds: string[], newColletionId: CollectionId<T>) => {
      await sereleumApiClient.moveItems(itemIds, newColletionId, collection.type)
      setItems(prev => prev.filter(prevItem =>  !itemIds.includes(prevItem.id)))
    }

    const onLoadMoreItems = async(limit: number, offset: number) => {
      if(items.length >= collection.size) return
      const result = await sereleumApiClient.getItems( collection.type, [collection.id], limit, offset)
      setItems(prev => [...prev, ...result] )
    }

    const onTagItems = async(tag: string, itemIds: string[] ) => {
      await sereleumApiClient.tagItems(tag, itemIds)
    }

    const loadTags = async() => {
      if(tags.length > 0 ) return 
        const fetchedTags = (await sereleumApiClient.getCollections(CollectionType.TAG)).map(t => t.name)
        setTags(fetchedTags)
    }


    return {
      tags,
      items,
      onMoveItems,
      onLoadMoreItems,
      onTagItems,
      loadTags
    };
  };
