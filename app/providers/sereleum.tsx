'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Cluster, OverviewInfo, ProviderProps, Status } from '@/app/types';
import { StorageKeys } from '../constants/global';
import * as LocalStorage from "@/app/lib/client/storage/session"
import { useRouter } from 'next/navigation';
import { apiPromptsClient, eventsClient } from '../sereleum';


const defaultOverview:OverviewInfo = {
  total_clusters: 0,
  total_items: 0,
  top_clusters: [],
}

  interface SereleumContextProps {
      clusters: Cluster[];
      setClusters: React.Dispatch<React.SetStateAction<Cluster[]>>;
      overview: OverviewInfo;
      setOverview: React.Dispatch<React.SetStateAction<OverviewInfo>>;
  }


  interface SereleumProviderProps extends ProviderProps {
    initialOverview?: OverviewInfo;
  }

  const SereleumContext = createContext<SereleumContextProps | undefined>(undefined);


  const SereleumProvider =({ 
    children, 
    initialOverview = defaultOverview 
  }: SereleumProviderProps) => {
    const [ clusters, setClusters ] = useState<Cluster[]>([]);
    const [ overview, setOverview ] = useState<OverviewInfo>(initialOverview);
    
    return (
      <SereleumContext.Provider value={{
        clusters,
        setClusters,
        overview, 
        setOverview
      }}>
        {children}
      </SereleumContext.Provider>
    );
  };

  const useManageClusters = (initialClusters: Cluster[] = []) => {
    const context = useContext(SereleumContext);
    if (!context) {
      throw new Error('useManageClusters must be used within a SereleumProvider');
    }

    const { clusters, overview, setClusters, setOverview } = context;

    useEffect(() => {
      if(clusters.length == 0 && initialClusters.length > 0) {
        setClusters(initialClusters)
      }
      
    }, [initialClusters, clusters])


    const onGetCluster = async(clusterId: string): Promise<Cluster> => {
      const clusters =  await apiPromptsClient.getClusters(clusterId)
      return clusters[0]
    }

    const onLoadMoreClusters = async(limit: number, offset: number) => {
      if(clusters.length >= overview.total_clusters) return
      const result = await apiPromptsClient.getClusters(undefined, limit, offset)
      setClusters(prev => [...prev, ...result] )
    }

    const onRenameCluster = async(clusterId: string, name: string) => {
      const newLabel = await apiPromptsClient.renameCluster(clusterId, name)
      setClusters((prev) => prev.map((c) => c.id === clusterId? {...c, label: newLabel} : c ) );
    }

    // TODO: Remove usage of top cluster and revenge overviev
    const onMergeClusters = async(primaryClusterId: string, secondaryClusterIds: string[]) => {
      const merges: Record<string, string[]> = {
        [primaryClusterId]: secondaryClusterIds,
      };
      const updatedClusters = await apiPromptsClient.mergeClusters(merges);
      const updatedOverview = await apiPromptsClient.getOverview(); // required because merging changes overview
      setClusters(prev => prev.map(cluster => cluster.id === updatedClusters[0].id ? updatedClusters[0] : cluster).filter(cluster => !secondaryClusterIds.includes(cluster.id)))
      setOverview(updatedOverview)
    }

    return {
        clusters,
        overview,
        onLoadMoreClusters,
        onRenameCluster,
        onMergeClusters,
        onGetCluster
      };
  };


  const useDashboard = () => {

    const context = useContext(SereleumContext);
    if (!context) {
      throw new Error('useDashboard must be used within a SereleumProvider');
    }

    const { overview, setOverview } = context;

    const [progress, setProgress] = useState<number>(0);
    const [indexingStatus, setIndexingStatus] = useState<Status|null>(null);
    const [clusteringStatus, setClusteringStatus] = useState<Status|null>(null);
    const [trackerMinimized, setTrackerMinimized] = useState(false);
    const [clusterPlotUrl, setClusterPlotUrl] = useState<string | null>(null);
    const [itemsFile, setItemsFile] = useState<File | null>(null);
    const [error, setError] = useState<string|null>(null);

    const router = useRouter();
    const isViewAllVisible = overview.total_clusters > overview.top_clusters.length


    const handleTrackIndexProgress = (jobId: string) => {
        const eventSource = eventsClient.trackIndexProgress(jobId, {
          onProgress: (p) => {
            setProgress(p)
          },
          onComplete: async() => {
            LocalStorage.remove(StorageKeys.indexingJobId)
            setIndexingStatus("complete")
            handleTrackClusteringStatus(jobId)
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
      const eventSource = eventsClient.trackClusterStatus(jobId, {
        onComplete: async() => {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const updatedOverview = await apiPromptsClient.getOverview();
          setOverview(updatedOverview)
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
      a: OverviewInfo,
      b: OverviewInfo
    ): boolean => {
      if (a.total_items !== b.total_items) return false;
      if (a.total_clusters !== b.total_clusters) return false;

      if (a.top_clusters.length !== b.top_clusters.length) return false;
      for (let i = 0; i < a.top_clusters.length; i++) {
        const clusterA = a.top_clusters[i];
        const clusterB = b.top_clusters[i];
        if (clusterA.id !== clusterB.id) return false;
      }

      return true;
    }


    useEffect(() => {
      if ( clusteringStatus !== null) return;

      let url: string | null = null;
      

      const fetchPlot = async () => {
        const request = indexedDB.open("ClusterPlotDB", 1);
        const cachedOverview = LocalStorage.get<OverviewInfo>(StorageKeys.overview) as OverviewInfo | null;
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
            if(cachedOverview && isSameOverview(cachedOverview, overview)) {
              url = URL.createObjectURL(cachedBlob);
              setClusterPlotUrl(url);
              return
            }else{
              const txWriteDelete = db.transaction("plots", "readwrite");
              txWriteDelete.objectStore("plots").delete("clusterPlot");          
            }    
          }   

          const blob = await apiPromptsClient.getClusterPlotBlob();
          if (blob) {
            LocalStorage.set(StorageKeys.overview, JSON.stringify(overview));
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
  }, [clusteringStatus, overview]);



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
      if(!itemsFile) return
      const res = await apiPromptsClient.indexItems(itemsFile, {autoLabel: false})
      setItemsFile(null)
      setIndexingStatus(res.status)
      LocalStorage.set(StorageKeys.indexingJobId, res.job_id)
      handleTrackIndexProgress(res.job_id)
    }

    const updateItemsFile = (file:File | null) => setItemsFile(file)

    const updateTrackerVisibility = (isMinimized: boolean) => setTrackerMinimized(isMinimized)
    
    const resetError = () => setError(null)

    return {
      progress,
      indexingStatus,
      clusteringStatus, 
      clusterPlotUrl,
      overview,
      trackerMinimized,
      itemsFile,
      isViewAllVisible,
      error,
      handleFileUpload,
      goToClustersPage,
      updateTrackerVisibility,
      updateItemsFile,
      resetError
    }
      
  }
  
  export { SereleumContext, SereleumProvider, useManageClusters, useDashboard };

