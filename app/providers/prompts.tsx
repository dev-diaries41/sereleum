'use client'
import React, { createContext, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { Cluster, Prompt, ProviderProps } from '@/app/types';
import { StorageKeys } from '../constants/global';
import * as LocalStorage from "@/app/lib/client/storage/session"
import { reveliumClient } from '../revelium/client';
 
interface PromptsContextProps {
    clusters: Omit<Cluster, "embedding">[];
    setClusters: React.Dispatch<React.SetStateAction<Omit<Cluster, "embedding">[]>>;
    prompts: Prompt[];
    setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
}

const PromptsContext = createContext<PromptsContextProps | undefined>(undefined);

const PromptsProvider = ({ children, initialClusters, initialPrompts }: ProviderProps & {initialClusters: Omit<Cluster, "embedding">[], initialPrompts: Prompt[]}) => {
    const [ clusters, setClusters ] = useState<Omit<Cluster, "embedding">[]>(initialClusters);
    const [ prompts, setPrompts ] = useState<Prompt[]>(initialPrompts);

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
      prompts,
      setPrompts
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

const { clusters, setClusters, prompts, setPrompts } = context;

const onUpdatePrompt = async(prompt: Prompt, newClusterId: string) => {
  // alert("updating prompt " +  prompt.prompt_id)
  const res = await reveliumClient.updatePromptClusterId(prompt.prompt_id, newClusterId)
  setPrompts(prev => prev.map(p => p.prompt_id === prompt.prompt_id? {...p, metadata: {...p.metadata, cluster_id: newClusterId}} : p))
}
    return {
        clusters,
        setClusters,
        prompts, 
        setPrompts,
        onUpdatePrompt
     };
};


export { PromptsContext, PromptsProvider, usePrompts };
