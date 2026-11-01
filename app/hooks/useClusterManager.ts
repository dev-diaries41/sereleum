'use client'

import { useState } from "react";
import { SereleumApiClient } from "../sereleum/server";
import { Cluster, DocItem } from "../types";

export const useClusterManager = <T extends DocItem = DocItem>(apiClient: SereleumApiClient<T>, cluster: Cluster) => {
    const [ items, setItems ] = useState<T[]>([]);
    
    const onMoveItem = async(itemId: string, newClusterId: string) => {
      const updatedClusterId = await apiClient.moveItem(itemId, newClusterId)
      setItems(prev => prev.filter(prevItem => prevItem.id !== itemId))
    }

    const onLoadMoreItems = async(limit: number, offset: number) => {
      if(items.length >= cluster.prototype_size) return
      const result = await apiClient.getItems(limit, offset)
      setItems(prev => [...prev, ...result] )
    }

    return {
        items,
        setItems,
        onMoveItem,
        onLoadMoreItems,
      };
  };
