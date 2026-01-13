'use client'
import React, { createContext, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { Cluster, ProviderProps } from '@/app/types';
import { StorageKeys } from '../constants/global';
import * as LocalStorage from "@/app/lib/client/storage/session"
 
interface PromptsContextProps {
    clusters: Omit<Cluster, "embedding">[];
    setClusters: React.Dispatch<React.SetStateAction<Omit<Cluster, "embedding">[]>>;
}

const PromptsContext = createContext<PromptsContextProps | undefined>(undefined);

const PromptsProvider = ({ children, initialClusters }: ProviderProps & {initialClusters: Omit<Cluster, "embedding">[]}) => {
    const [ clusters, setClusters ] = useState<Omit<Cluster, "embedding">[]>(initialClusters);

    // useLayoutEffect(() => {
    //     const clusters = LocalStorage.get<Omit<Cluster, "embedding">[]>(StorageKeys.clusters);
    //     if (clusters && Array.isArray(clusters) && clusters.length > 0 ) {
    //         setClusters(clusters); 
    //     }
    // }, []);

      useEffect(() => {
        if(initialClusters.length > 0){
          LocalStorage.set(StorageKeys.clusters, JSON.stringify(initialClusters));
        }
       
    }, []);
    
    
   
  return (
    <PromptsContext.Provider value={{
      clusters,
      setClusters,
    }}>
      {children}
    </PromptsContext.Provider>
  );
};

const usePrompts = () => {
  const context = useContext(PromptsContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptsProvider');
  }

const { clusters, setClusters } = context;
    return {
        clusters,
        setClusters,
     };
};


export { PromptsContext, PromptsProvider, usePrompts };
