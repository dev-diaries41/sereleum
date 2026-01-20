'use client';

import {  Cluster, PromptsOverviewInfo, Status } from '@/app/types';
import  { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faLayerGroup, faMoneyBill, faSpinner, faTag, faTerminal } from '@fortawesome/free-solid-svg-icons';
import FileUploader from '../common/upload';
import {  AcceptedMimes, StorageKeys } from '@/app/constants/global';
import { reveliumClient } from '@/app/revelium/client';
import { ClusterRow } from '../revelium/cluster-row';
import { MetricCard } from './metric-card';
import { usePrompts } from '@/app/providers/prompts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IndexProgressTrackerPopUp } from '../common/progress-tracker';
import * as LocalStorage from "@/app/lib/client/storage/local"


const N_TOP_CLUSTERS = 5

export function DashboardOverview() {
  const [promptsFile, setPromptsFile] = useState<File | null>(null)
  const { clusters, setClusters, promptsOverview: overview, updatePromptsOverview} = usePrompts()
  const [clusterPlotUrl, setClusterPlotUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<Status|null>(null);
  const [trackerMinimized, setTrackerMinimized] = useState(false);

  const router = useRouter();
  const metrics = useMemo(() => {
    return [
      { key: 'total_clusters', title: 'Total Clusters', value: overview.total_clusters, icon: faLayerGroup },
      { key: 'label_clusters', title: 'Labelled Clusters', value: 0, icon: faTag },
      { key: 'total_prompts', title: 'Total Prompts', value: overview.total_prompts, icon: faTerminal },
      { key: 'average_prompt_cost', title: 'Average Token Cost', value: formatCost(overview.average_prompt_cost), icon: faMoneyBill },
    ];
  }, [overview]);


  const handleTrackIndexProgress = (jobId: string) => {
      const eventSource = reveliumClient.trackPromptsIndexProgress(jobId, {
        onProgress: (p) => {
          setProgress(p)
        },
        onComplete: async() => {
          LocalStorage.remove(StorageKeys.indexingJobId)
          const promptOverview = await reveliumClient.getPromptsOverview();
          const clusters = await reveliumClient.getClusters()
          updatePromptsOverview(promptOverview)
          setClusters(clusters)
          setStatus("complete")
        },
        onFail: (e) => {
          setStatus("failed")
          LocalStorage.remove(StorageKeys.indexingJobId)
          alert(e)
        },
        onActive: () => setStatus('active'),
      })
  }

const hasFetechPlot = useRef(false);

useEffect(() => {
  if (hasFetechPlot.current && status !== "complete") return;
  hasFetechPlot.current = true;

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
}, [status]);



  useEffect(() => {
    if(status === "complete" || status === "failed"){
      setTimeout(()=>{
        setStatus(null)
        setProgress(0)
        setTrackerMinimized(false)
      }, 1000
)
    }
  }, [status, trackerMinimized])


  useEffect(() => {
    const jobId = LocalStorage.get<string>(StorageKeys.indexingJobId)
    if(jobId){
      handleTrackIndexProgress(jobId)
    }
  }, [])

  const handleFileUpload = async() => {
    if(!promptsFile) return
    const res = await reveliumClient.addPromptsFile(promptsFile)
    setStatus(res.status)
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
            {(status === "active") && trackerMinimized && (
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
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((m) => (
              <MetricCard key={m.key} title={m.title} value={m.value} icon={m.icon}/>
            ))}
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: clusters list (span 2) */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Clusters</h3>
                  <p className="text-sm text-gray-500">Top clusters and similarity metrics</p>
                </div>
                <div className="text-sm text-gray-500">{clusters.length} clusters</div>
              </div>

              <div className="flex flex-col gap-2">
                {clusters.length === 0 ? (
                  <div className="text-sm text-gray-500 py-6 text-center">No clusters yet — add prompts to generate clusters</div>
                ) : (
                  clusters.slice(0, N_TOP_CLUSTERS).map((cluster, i) => 
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
                { ( clusters.length > N_TOP_CLUSTERS) &&  <button
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
                    <div className="text-sm text-gray-400">No plot available</div>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">Downloadable preview available</div>
              </div>
            </div>
          </div>

          {/* optional analytics footer */}
          <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-semibold mb-2">Token Cost (7d)</h4>
              <div className="text-2xl font-extrabold">{formatCost(overview.average_prompt_cost)}</div>
              <p className="text-xs text-gray-500 mt-2">Average token cost per prompt</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-semibold mb-2">Prototype Coverage</h4>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold">{calculateCoverage(clusters)}%</div>
                <div className="text-xs text-gray-500">Prototypes across clusters</div>
              </div>
            </div>

            {/* <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
              <div className="flex flex-col gap-2 mt-3">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"> Index prompts</button>
                <button onClick = {handleClusterPrompts} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"> Cluster prompts</button>
              </div>
            </div> */}
          </div>

        </div>
      </div>
         {progress > 0  && <IndexProgressTrackerPopUp
          progress={progress} 
          status={status} 
          title={"Indexing prompts"}
          minimized = {trackerMinimized}
          onMinimize={() => setTrackerMinimized(true)}
          />
          }
    </div>
  );
}


function formatCost(n: number | undefined | null) {
  if (n === null || n === undefined) return '—';
  const asNumber = Number(n) || 0;
  if (asNumber === 0) return '0';
  return `$${(asNumber).toFixed(2)}`;
}

function calculateCoverage(clusters: Omit<Cluster, "embedding">[]) {
  if (!clusters || clusters.length === 0) return 0;
  const totalPrototypes = clusters.reduce((s, c) => s + (c.metadata.prototype_size || 0), 0);
  const coverage = Math.min(100, Math.round((totalPrototypes / Math.max(1, totalPrototypes + 4)) * 100));
  return coverage;
}