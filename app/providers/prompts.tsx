'use client'
import React, { createContext, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { Cluster, Prompt, PromptsOverviewInfo, ProviderProps } from '@/app/types';
import { StorageKeys } from '../constants/global';
import * as LocalStorage from "@/app/lib/client/storage/session"
import { reveliumClient } from '../revelium/client';
 
interface PromptsContextProps {
    clusters: Omit<Cluster, "embedding">[];
    setClusters: React.Dispatch<React.SetStateAction<Omit<Cluster, "embedding">[]>>;
    prompts: Prompt[];
    setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
    promptsOverview: PromptsOverviewInfo;
    setPromptsOverview: React.Dispatch<React.SetStateAction<PromptsOverviewInfo>>;
}

const PromptsContext = createContext<PromptsContextProps | undefined>(undefined);

interface PromptsProviderProps extends ProviderProps {
  initialClusters: Omit<Cluster, "embedding">[]; 
  initialPrompts: Prompt[];
  overview: PromptsOverviewInfo;
}
const PromptsProvider = ({ children, initialClusters, initialPrompts, overview }: PromptsProviderProps) => {
    const [ clusters, setClusters ] = useState<Omit<Cluster, "embedding">[]>(initialClusters);
    const [ prompts, setPrompts ] = useState<Prompt[]>(initialPrompts);
    const [ promptsOverview, setPromptsOverview ] = useState<PromptsOverviewInfo>(overview);

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
      setPrompts,
      promptsOverview, 
      setPromptsOverview
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

const { clusters, prompts, promptsOverview,  setClusters, setPrompts, setPromptsOverview } = context;

const onUpdatePrompt = async(prompt: Prompt, newClusterId: string) => {
  const res = await reveliumClient.updatePromptClusterId(prompt.prompt_id, newClusterId)
  setPrompts(prev => prev.map(p => p.prompt_id === prompt.prompt_id? {...p, metadata: {...p.metadata, cluster_id: newClusterId}} : p))
}

const onLoadMorePrompts = async(limit: number, offset: number) => {
  if(prompts.length >= promptsOverview.total_prompts) return
  const result = await reveliumClient.getPrompts(undefined, limit, offset)
  setPrompts(prev => [...prev, ...result] )
}

const updatePromptsOverview =(promptOverview: PromptsOverviewInfo) => {
  setPromptsOverview(promptOverview)
}


return {
    clusters,
    prompts, 
    promptsOverview,
    setClusters,
    setPrompts,
    onUpdatePrompt,
    onLoadMorePrompts,
    updatePromptsOverview
  };
};


export { PromptsContext, PromptsProvider, usePrompts };
