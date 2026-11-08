'use client'
import React, { useState, useEffect } from 'react';
import { OverviewInfo, Status } from '@/app/types';
import { StorageKeys } from '../constants/global';
import * as LocalStorage from "@/app/lib/client/storage/session"
import { useRouter } from 'next/navigation';
import { sereleumApiClient, sereleumEventsClient } from '../sereleum';


export const useDashboard = (initialOverview: OverviewInfo) => {
    const [overview, setOverview ] = useState<OverviewInfo>(initialOverview);
    const [progress, setProgress] = useState<number>(0);
    const [indexingStatus, setIndexingStatus] = useState<Status|null>(null);
    const [clusteringStatus, setClusteringStatus] = useState<Status|null>(null);
    const [trackerMinimized, setTrackerMinimized] = useState(false);
    const [itemsFile, setItemsFile] = useState<File | null>(null);
    const [error, setError] = useState<string|null>(null);

    const router = useRouter();
    const isViewAllVisible = overview.total_clusters > overview.top_clusters.length

    const handleTrackIndexProgress = (jobId: string) => {
        const eventSource = sereleumEventsClient.trackIndexProgress(jobId, {
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
      const eventSource = sereleumEventsClient.trackClusterStatus(jobId, {
        onComplete: async() => {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const updatedOverview = await sereleumApiClient.getOverview();
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
      const res = await sereleumApiClient.indexItems(itemsFile, {autoLabel: false})
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