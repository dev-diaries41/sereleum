'use client'
import React, { createContext, useState, useContext, useLayoutEffect, useEffect } from 'react';
import { Cluster, Prompt, PromptsOverviewInfo, ProviderProps, Status } from '@/app/types';
import { StorageKeys } from '../constants/global';
import * as LocalStorage from "@/app/lib/client/storage/session"
import { sereleumClient } from "@/app/client";
import { useRouter } from 'next/navigation';
 
interface PromptsContextProps {
    clusters: Cluster[];
    setClusters: React.Dispatch<React.SetStateAction<Cluster[]>>;
    topClusters: Cluster[];
    setTopClusters: React.Dispatch<React.SetStateAction<Cluster[]>>;
    prompts: Prompt[];
    setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
    promptsOverview: PromptsOverviewInfo;
    setPromptsOverview: React.Dispatch<React.SetStateAction<PromptsOverviewInfo>>;
}

const PromptsContext = createContext<PromptsContextProps | undefined>(undefined);

interface PromptsProviderProps extends ProviderProps {
  initialClusters?: Cluster[]; 
  initialPrompts?: Prompt[];
  overview?: PromptsOverviewInfo;
}

const defaultOverview:PromptsOverviewInfo = {
  total_clusters: 0,
  total_prompts: 0,
  top_clusters: [],
  top_cluster_token_counts: {}
}

const PromptsProvider = ({ children, initialClusters= [], initialPrompts = [], overview = defaultOverview }: PromptsProviderProps) => {
  const [ clusters, setClusters ] = useState<Cluster[]>(initialClusters);
  const [ topClusters, setTopClusters ] = useState<Cluster[]>(overview.top_clusters);
  const [ prompts, setPrompts ] = useState<Prompt[]>(initialPrompts);
  const [ promptsOverview, setPromptsOverview ] = useState<PromptsOverviewInfo>(overview);
  
  useLayoutEffect(() => {
    async function fetchInitialPrompts(){
      const initialPrompts = await sereleumClient.getPrompts(undefined, 25)
      setPrompts(initialPrompts)
    }
    if(prompts.length == 0 && promptsOverview.total_prompts > 0) {
        fetchInitialPrompts();
      }
  }, [promptsOverview])

  useEffect(() => {
      setTopClusters(promptsOverview.top_clusters)
    }, [promptsOverview])

   
  return (
    <PromptsContext.Provider value={{
      clusters,
      setClusters,
      topClusters, 
      setTopClusters,
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

const { clusters, topClusters, prompts, promptsOverview,  setTopClusters, setClusters, setPrompts } = context;

const onUpdatePrompt = async(prompt: Prompt, newClusterId: string) => {
  const res = await sereleumClient.updatePromptClusterId(prompt.id, newClusterId)
  setPrompts(prev => prev.map(p => p.id === prompt.id? {...p, metadata: {...p.metadata, cluster_id: newClusterId}} : p))
}

const onLoadMorePrompts = async(limit: number, offset: number) => {
  if(prompts.length >= promptsOverview.total_prompts) return
  const result = await sereleumClient.getPrompts(undefined, limit, offset)
  setPrompts(prev => [...prev, ...result] )
}

const onLoadMoreClusters = async(limit: number, offset: number) => {
  if(prompts.length >= promptsOverview.total_prompts) return
  const result = await sereleumClient.getClusters(undefined, limit, offset)
  setClusters(prev => [...prev, ...result] )
}

return {
    clusters,
    topClusters,
    prompts, 
    promptsOverview,
    setTopClusters,
    setClusters,
    setPrompts,
    onUpdatePrompt,
    onLoadMorePrompts,
    onLoadMoreClusters,
  };
};


const useDashboard = () => {

  const context = useContext(PromptsContext);
  if (!context) {
    throw new Error('useDashboard must be used within a PromptsProvider');
  }

  const { promptsOverview, topClusters, setClusters, setPromptsOverview } = context;

  const [progress, setProgress] = useState<number>(0);
  const [indexingStatus, setIndexingStatus] = useState<Status|null>(null);
  const [clusteringStatus, setClusteringStatus] = useState<Status|null>(null);
  const [trackerMinimized, setTrackerMinimized] = useState(false);
  const [clusterPlotUrl, setClusterPlotUrl] = useState<string | null>(null);
  const [promptsFile, setPromptsFile] = useState<File | null>(null);
  const [error, setError] = useState<string|null>(null);

  const router = useRouter();
  const isViewAllVisible = promptsOverview.total_clusters > topClusters.length 

  const updatePromptsOverview =(promptOverview: PromptsOverviewInfo) => {
    setPromptsOverview(promptOverview)
  }
  const handleTrackIndexProgress = (jobId: string) => {
      const eventSource = sereleumClient.trackPromptsIndexProgress(jobId, {
        onProgress: (p) => {
          setProgress(p)
        },
        onComplete: async() => {
          LocalStorage.remove(StorageKeys.indexingJobId)
          setIndexingStatus("complete")
          const clusterJobId = "cluster_job_status" // DEV ONLY
          handleTrackClusteringStatus(clusterJobId)
        },
        onFail: (e) => {
          setIndexingStatus("failed")
          LocalStorage.remove(StorageKeys.indexingJobId)
          setError(e)
        },
        onActive: () => setIndexingStatus('active'),
      })
  }

  const handleTrackClusteringStatus = (jobId: string) => {
    setClusteringStatus('queued')
    const eventSource = sereleumClient.trackPromptsClusterStatus(jobId, {
      onComplete: async() => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const promptOverview = await sereleumClient.getPromptsOverview();
        const clusters = await sereleumClient.getClusters()
        updatePromptsOverview(promptOverview)
        setClusters(clusters)
        setClusteringStatus("complete")
      },
      onFail: (e) => {
        setClusteringStatus("failed")
        setError(e)
      },
      onActive: () => setClusteringStatus('active'),
    })
  }

  const goToClustersPage = () => {
      router.push('/dashboard/clusters');
  }


  const isSameOverview = (
    a: PromptsOverviewInfo,
    b: PromptsOverviewInfo
  ): boolean => {
    if (a.total_prompts !== b.total_prompts) return false;
    if (a.total_clusters !== b.total_clusters) return false;

    if (a.top_clusters.length !== b.top_clusters.length) return false;
    for (let i = 0; i < a.top_clusters.length; i++) {
      const clusterA = a.top_clusters[i];
      const clusterB = b.top_clusters[i];
      if (clusterA.prototype_id !== clusterB.prototype_id) return false;
    }

    const keysA = Object.keys(a.top_cluster_token_counts);
    const keysB = Object.keys(b.top_cluster_token_counts);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (a.top_cluster_token_counts[key] !== b.top_cluster_token_counts[key]) return false;
    }

    return true;
  }


  useEffect(() => {
    if ( clusteringStatus !== null) return;

    let url: string | null = null;
    

    const fetchPlot = async () => {
      const request = indexedDB.open("ClusterPlotDB", 1);
      const cachedOverview = LocalStorage.get<PromptsOverviewInfo>(StorageKeys.overview) as PromptsOverviewInfo | null;
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("plots")) {
          db.createObjectStore("plots");
        }
      };

      request.onsuccess = async () => {
        const db = request.result;
        const tx = db.transaction("plots", "readonly");
        const store = tx.objectStore("plots");
        const cachedBlob = await new Promise<Blob | undefined>((resolve) => {
          const getReq = store.get("clusterPlot");
          getReq.onsuccess = () => resolve(getReq.result);
          getReq.onerror = () => resolve(undefined);
        });


        if (cachedBlob) {
          if(cachedOverview && isSameOverview(cachedOverview, promptsOverview)) {
            url = URL.createObjectURL(cachedBlob);
            setClusterPlotUrl(url);
            return
          }else{
            const txWriteDelete = db.transaction("plots", "readwrite");
            txWriteDelete.objectStore("plots").delete("clusterPlot");          
          }    
        }   

        const blob = await sereleumClient.getClusterPlotBlob();
        if (blob) {
          LocalStorage.set(StorageKeys.overview, JSON.stringify(promptsOverview));
          url = URL.createObjectURL(blob);
          setClusterPlotUrl(url);

        const txWrite = db.transaction("plots", "readwrite");
          txWrite.objectStore("plots").put(blob, "clusterPlot");
        }
      };

      request.onerror = (e) => console.error("IndexedDB error", e);
    };

    fetchPlot();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
}, [clusteringStatus, promptsOverview]);



  useEffect(() => {
    if(indexingStatus === "complete" || indexingStatus === "failed"){
      setTimeout(()=>{
        setIndexingStatus(null)
        setProgress(0)
        setTrackerMinimized(false)
      }, 750
)
    }
  }, [indexingStatus])


  useEffect(() => {
    if(clusteringStatus === "complete" || clusteringStatus === "failed"){
      setTimeout(()=>{
        setClusteringStatus(null)
        setTrackerMinimized(false)
      }, 1000
)
    }
  }, [clusteringStatus])


  useEffect(() => {
    const jobId = LocalStorage.get<string>(StorageKeys.indexingJobId)
    if(jobId){
      handleTrackIndexProgress(jobId)
    }
  }, [])

  const handleFileUpload = async() => {
    if(!promptsFile) return
    const res = await sereleumClient.addPromptsFile(promptsFile, {autoLabel: false})
    setPromptsFile(null)
    setIndexingStatus(res.status)
    LocalStorage.set(StorageKeys.indexingJobId, res.job_id)
    handleTrackIndexProgress(res.job_id)
  }

  const updatePromptsFile = (file:File | null) => setPromptsFile(file)

  const updateTrackerVisibility = (isMinimized: boolean) => setTrackerMinimized(isMinimized)
  
  const resetError = () => setError(null)

  return {
    progress,
    indexingStatus,
    clusteringStatus, 
    clusterPlotUrl,
    promptsOverview,
    trackerMinimized,
    promptsFile,
    topClusters,
    isViewAllVisible,
    error,
    handleFileUpload,
    goToClustersPage,
    updateTrackerVisibility,
    updatePromptsFile,
    resetError
  }
    
}


export { PromptsContext, PromptsProvider, usePrompts, useDashboard };
