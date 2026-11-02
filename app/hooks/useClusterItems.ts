'use client'

import { useEffect, useState } from "react";
import { Cluster, DocItem, Prompt } from "../types";
import { apiPromptsClient } from "../sereleum";

export const useClusterItems = (cluster: Cluster, pageSize: number) => {
    const [ items, setItems ] = useState<DocItem[]>([]);

    useEffect(() => {
       apiPromptsClient.getItems(pageSize, undefined, [cluster.id]).then(
        result => setItems(result)
       )
    }, [])
    
    const onMoveItem = async(itemId: string, newClusterId: string) => {
      const updatedClusterId = await apiPromptsClient.moveItem(itemId, newClusterId)
      setItems(prev => prev.filter(prevItem => prevItem.id !== itemId))
    }

    const onLoadMoreItems = async(limit: number, offset: number) => {
      if(items.length >= cluster.prototype_size) return
      const result = await apiPromptsClient.getItems(limit, offset)
      setItems(prev => [...prev, ...result] )
    }

    return {
        items,
        setItems,
        onMoveItem,
        onLoadMoreItems,
      };
  };
