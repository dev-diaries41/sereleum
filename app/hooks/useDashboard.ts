'use client'
import React, { useState, useEffect } from 'react';
import { OverviewInfo, Status } from '@/app/types';
import { StorageKeys } from '../constants/global';
import * as LocalStorage from "@/app/lib/client/storage/session"
import { useRouter } from 'next/navigation';
import { apiPromptsClient, eventsClient } from '../sereleum';


const defaultOverview:OverviewInfo = {
  total_clusters: 0,
  total_items: 0,
  total_tags: 0,
  top_tags: [],
  top_clusters: [],
}



export const useDashboard = () => {
    const [overview, setOverview ] = useState<OverviewInfo>(defaultOverview);
    const [progress, setProgress] = useState<number>(0);
    const [indexingStatus, setIndexingStatus] = useState<Status|null>(null);
    const [clusteringStatus, setClusteringStatus] = useState<Status|null>(null);
    const [trackerMinimized, setTrackerMinimized] = useState(false);
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
    
    const goToTagsPage = () => {
        router.push('/dashboard/tags');
    }

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
      overview,
      trackerMinimized,
      itemsFile,
      isViewAllVisible,
      error,
      handleFileUpload,
      goToClustersPage,
      goToTagsPage,
      updateTrackerVisibility,
      updateItemsFile,
      resetError
    }
      
  }