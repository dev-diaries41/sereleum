'use client';

import {  PromptsOverviewInfo, Status } from '@/app/types';
import  { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faLayerGroup, faLightbulb, faSpinner } from '@fortawesome/free-solid-svg-icons';
import FileUploader from '../common/upload';
import {  AcceptedMimes, StorageKeys } from '@/app/constants/global';
import { reveliumClient } from '@/app/revelium/client';
import { ClusterRow } from './cluster-row';
import { usePrompts } from '@/app/providers/prompts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgressTrackerPopUp } from '../common/progress-tracker';
import * as LocalStorage from "@/app/lib/client/storage/local"
import { OverviewSummary } from './overview-summary';


export function DashboardOverview() {
  const [promptsFile, setPromptsFile] = useState<File | null>(null)
  const { clusters, setClusters, topClusters,promptsOverview: overview, updatePromptsOverview} = usePrompts()
  const [clusterPlotUrl, setClusterPlotUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [indexingStatus, setIndexingStatus] = useState<Status|null>(null);
  const [clusteringStatus, setClusteringStatus] = useState<Status|null>(null);
  const [trackerMinimized, setTrackerMinimized] = useState(false);
  const router = useRouter();

  const handleTrackIndexProgress = (jobId: string) => {
      const eventSource = reveliumClient.trackPromptsIndexProgress(jobId, {
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
          alert(e)
        },
        onActive: () => setIndexingStatus('active'),
      })
  }

  const handleTrackClusteringStatus = (jobId: string) => {
    setClusteringStatus('queued')
    const eventSource = reveliumClient.trackPromptsClusterStatus(jobId, {
      onComplete: async() => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const promptOverview = await reveliumClient.getPromptsOverview();
        const clusters = await reveliumClient.getClusters()
        updatePromptsOverview(promptOverview)
        setClusters(clusters)
        setClusteringStatus("complete")
      },
      onFail: (e) => {
        setClusteringStatus("failed")
        alert(e)
      },
      onActive: () => setClusteringStatus('active'),
    })
  }


  useEffect(() => {
    if (clusteringStatus !== null) return;

    let url: string | null = null;

    const fetchPlot = async () => {
      const request = indexedDB.open("ClusterPlotDB", 1);
      const cachedOverview = LocalStorage.get<PromptsOverviewInfo>(StorageKeys.overview) as PromptsOverviewInfo | null;
      const isTheSameOverview = cachedOverview?.total_prompts === overview.total_prompts;

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

        if (cachedBlob && isTheSameOverview) {
          url = URL.createObjectURL(cachedBlob);
          setClusterPlotUrl(url);
          return;
        }

        const blob = await reveliumClient.getClusterPlotBlob();
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
  }, [clusteringStatus]);



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
    const res = await reveliumClient.addPromptsFile(promptsFile)
    setPromptsFile(null)
    setIndexingStatus(res.status)
    LocalStorage.set(StorageKeys.indexingJobId, res.job_id)
    handleTrackIndexProgress(res.job_id)
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full">
      <div className="w-full flex flex-col mx-auto px-4">
        <div className="flex flex-col w-full min-h-screen items-center py-8 pt-24 lg:pt-8">

          <div className="w-full flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>
            </div>
            <div className="flex flex-col items-start gap-3">
           <div className="flex flex-row gap-3 items-center">
            {((indexingStatus === "active") || (clusteringStatus === "active")) && trackerMinimized && (
              <button
                onClick={() => setTrackerMinimized(false)}
                className="flex items-center justify-center px-4"
                aria-label="Show indexing progress"
              >
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="w-6 h-6 text-indigo-600"
                />
              </button>
                )}
                {promptsFile ? (
                  <button
                    onClick={handleFileUpload}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-md"
                  >
                    Upload Prompts
                  </button>
                ) : (
                  <FileUploader
                    onFileUpload={(files) => setPromptsFile(files[0])}
                    acceptedMimes={AcceptedMimes}
                  >
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-md">
                      Add Prompts
                    </span>
                  </FileUploader>
                )}
              </div>
          
              {promptsFile && (
                <div className='flex flex-row gap-2 items-center'>
                  <button onClick={() => setPromptsFile(null)}>
                    <FontAwesomeIcon icon={faClose} className="w-4 h-4 text-red-700" />
                  </button>
                  <p>{promptsFile.name}</p>
                </div>
              )
              }
            </div>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <OverviewSummary overview={overview}/>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 w-full flex flex-col">
              <div className='flex justify-between'>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Summary Insights
                </p>
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="w-6 h-6 opacity-50"
                />
              </div>
              {overview.summary_insights ? (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {overview.summary_insights}
                </p>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">
                      No insights yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Insights will appear once clusters have been created
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Top Clusters</h3>
                </div>
                  <FontAwesomeIcon
                  icon={faLayerGroup}
                  className="w-6 h-6 opacity-50"
                />
              </div>

              <div className="flex flex-col gap-2">
                {topClusters.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">
                      No clusters yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Top cluster will be shown once prompts added
                    </p>
                  </div>
                </div>
                ) : (
                  topClusters.map((cluster, i) => 
                    <Link
                        key={cluster.prototype_id}
                        href={`/dashboard/clusters/cluster/${cluster.prototype_id}`}
                        className="block"
                      >
                        <ClusterRow cluster={cluster} />
                    </Link>
                )
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">Prototype separation and similarity help you understand cluster cohesion</div>
                { ( clusters.length > topClusters.length) &&  <button
                  className="text-sm text-indigo-600"
                  onClick={() => {
                    setClusters(clusters);
                    router.push('/dashboard/clusters');
                  }}
                >
                  View all clusters
                </button>}              
              </div>
            </div>

            {/* Right: cluster plot image */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold">Cluster Plot</h4>
                    <p className="text-xs text-gray-500">2D visualization of prompt clusters</p>
                  </div>
                </div>

                <div className="flex-1 w-full min-h-[220px] flex items-center justify-center">
                  {clusterPlotUrl ? (
                    <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-50">
                      <Image
                        src={clusterPlotUrl}
                        alt="Cluster plot"
                        width={800}
                        height={480}
                        style={{ objectFit: 'contain' }}
                        className="w-full h-full"
                        priority={false}
                      />
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-400">No plot available</p>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">Downloadable preview available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
         {indexingStatus == "active"  && <ProgressTrackerPopUp
          progress={progress} 
          status={indexingStatus} 
          title={"Indexing prompts"}
          minimized = {trackerMinimized}
          onMinimize={() => setTrackerMinimized(true)}
          />
          }

        {clusteringStatus == 'active' && <ProgressTrackerPopUp
          status={clusteringStatus} 
          title={"Clustering prompts"}
          minimized = {trackerMinimized}
          description="Clustering is in progress. This may take a while depending on the number of prompts."
          onMinimize={() => setTrackerMinimized(true)}
          />
        }
    </div>
  );
}