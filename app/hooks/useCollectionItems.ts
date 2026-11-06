'use client'

import { useEffect, useState } from "react";
import {  Collection, CollectionId, DocItem } from "../types";
import { apiPromptsClient } from "../sereleum";
import { CollectionType } from "../enums/collections";

export const useCollectionItems = <T extends CollectionType = CollectionType>(collection: Collection<T>, initialItems: DocItem[] = []) => {
    const [ items, setItems ] = useState<DocItem[]>(initialItems);
    
    const onMoveItems = async(itemIds: string[], newColletionId: CollectionId<T>) => {
      await apiPromptsClient.moveItems(itemIds, newColletionId, collection.type)
      setItems(prev => prev.filter(prevItem =>  !itemIds.includes(prevItem.id)))
    }

    const onLoadMoreItems = async(limit: number, offset: number) => {
      if(items.length >= collection.size) return
      const result = await apiPromptsClient.getItems( collection.type, [collection.id], limit, offset)
      setItems(prev => [...prev, ...result] )
    }


    return {
        items,
        onMoveItems,
        onLoadMoreItems,
      };
  };
