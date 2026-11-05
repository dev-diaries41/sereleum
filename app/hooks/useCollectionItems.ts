'use client'

import { useEffect, useState } from "react";
import {  Collection, DocItem } from "../types";
import { apiPromptsClient } from "../sereleum";
import { CollectionType } from "../enums/collections";

export const useCollectionItems = (collection: Collection, pageSize: number) => {
    const [ items, setItems ] = useState<DocItem[]>([]);

    useEffect(() => {
      if(collection.type === CollectionType.CLUSTER){
        apiPromptsClient.getItems(collection.type, [collection.id as string], pageSize).then(result => setItems(result))
      }else{
        apiPromptsClient.getItems(collection.type,[collection.id as number], pageSize).then(result => setItems(result))
      }
   
    }, [])
    
    const onMoveTagItems = async(itemIds: string[], newColletionId: number, currentCollectionId: number) => {
      await apiPromptsClient.moveItems(itemIds, newColletionId, CollectionType.TAG,  currentCollectionId)
      setItems(prev => prev.filter(prevItem =>  !itemIds.includes(prevItem.id)))
    }
    
    const onMoveClusterItems = async(itemIds: string[], newColletionId: string) => {
      await apiPromptsClient.moveItems(itemIds, newColletionId, CollectionType.CLUSTER)
      setItems(prev => prev.filter(prevItem =>  !itemIds.includes(prevItem.id)))
    }

    const onLoadMoreItems = async(limit: number, offset: number) => {
      if(collection.type === CollectionType.CLUSTER){
        onLoadMoreClusterItems(limit, offset)
      }else{
        onLoadMoreTagItems(limit, offset)
      }
    }

    const onLoadMoreClusterItems = async(limit: number, offset: number) => {
      if(items.length >= collection.size) return
      const result = await apiPromptsClient.getItems( CollectionType.CLUSTER, [collection.id as string], limit, offset)
      setItems(prev => [...prev, ...result] )
    }


    const onLoadMoreTagItems = async(limit: number, offset: number) => {
      if(items.length >= collection.size) return
      const result = await apiPromptsClient.getItems( CollectionType.TAG, [collection.id as number], limit, offset)
      setItems(prev => [...prev, ...result] )
    }

    return {
        items,
        setItems,
        onMoveTagItems,
        onMoveClusterItems,
        onLoadMoreItems,
      };
  };
