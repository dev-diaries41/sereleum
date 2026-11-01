'use client';

import Image from 'next/image';
import Link from 'next/link';
import {  Cluster, User } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faLayerGroup, faSpinner } from '@fortawesome/free-solid-svg-icons';
import FileUploader from '../common/upload';
import {  AcceptedMimes } from '@/app/constants/global';
import { ClusterRow } from './clusters/cluster-row';
import { useDashboard } from '@/app/providers/sereleum';
import { ProgressTrackerPopUp } from '../common/progress-tracker';
import { OverviewSummary } from './overview-summary';
import { ClusterDensityChart } from './charts/cluster-density';
import {InlinePopUp} from '../common/inline-popup';
import useOnboarding from '@/app/hooks/useOnboarding';
import { Questionnaire } from '../onboarding/questionnaire';
import { ONBOARDING_WELCOME_MESSAGE, ONBOARDING_WELCOME_TITLE, onboardingQuestions } from '@/app/constants/content/onboarding';

interface DashboardOverviewProps {
  user?: Partial<User>;
  hasCompletedOnboarding?: boolean;
}

export function DashboardOverview({user, hasCompletedOnboarding}: DashboardOverviewProps) {
  const {
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
  } = useDashboard()
  
  const {isVisible, isOnboarded, onCompleteOnboarding} = useOnboarding(user?.email);

  return (
    <div className="flex-1 mx-auto w-full p-8">
      {( !hasCompletedOnboarding && isVisible && !isOnboarded ) &&(
      <Questionnaire 
      onComplete={onCompleteOnboarding} 
      onboardingQuestions={onboardingQuestions} 
      welcomeMessage={ONBOARDING_WELCOME_MESSAGE} 
      welcomeTitle={ONBOARDING_WELCOME_TITLE}/>
      )}
      <div className="flex flex-col w-full items-center">
        <div className="w-full flex items-center justify-between mb-12">
          <div>
            <h1 className="text-xl md:text-2xl ">Overview</h1>
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-row gap-3 items-center">
              {((indexingStatus === "active") || (clusteringStatus === "active")) && trackerMinimized && (
                <button
                  onClick={() => updateTrackerVisibility(false)}
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
                  {itemsFile ? (
                    <button
                      disabled = {indexingStatus !== null || clusteringStatus !== null}
                      onClick={handleFileUpload}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-md"
                    >
                      Upload Prompts
                    </button>
                  ) : (
                    <FileUploader
                      onFileUpload={(files) => updateItemsFile(files[0])}
                      acceptedMimes={AcceptedMimes}
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-md">
                        Add Prompts
                      </span>
                    </FileUploader>
                  )}
                </div>
          
                {itemsFile && (
                  <div className='flex flex-row gap-2 items-center'>
                    <button onClick={() => updateItemsFile(null)}>
                      <FontAwesomeIcon icon={faClose} className="w-4 h-4 text-red-700" />
                    </button>
                    <p>{itemsFile.name}</p>
                  </div>
                )}
              </div>
          </div>
          {error && <InlinePopUp description={error} isError={true} onClose={resetError}/>}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <OverviewSummary overview={overview}/>
            <ClustersPlot url={clusterPlotUrl}/>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopClustersDetails topClusters={overview.top_clusters} isViewAllVisible ={isViewAllVisible } onViewAllClusters={goToClustersPage}/>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 my-6">
            {overview.top_clusters.length > 0 && <ClusterDensityChart clusters={overview.top_clusters} loading ={false}/>}
          </div>
        </div>
        {indexingStatus  && <ProgressTrackerPopUp
          progress={progress} 
          status={indexingStatus} 
          title={"Indexing prompts"}
          minimized = {trackerMinimized}
          onMinimize={() => updateTrackerVisibility(true)}
          />
          }

        {clusteringStatus && <ProgressTrackerPopUp
          status={clusteringStatus} 
          title={"Clustering prompts"}
          minimized = {trackerMinimized}
          description="Clustering is in progress. This may take a while depending on the number of prompts."
          onMinimize={() => updateTrackerVisibility(true)}
          />
        }
      </div>
    );
  }

interface ClustersPlotProps {
  url: string | null
}
 
function ClustersPlot({url}: ClustersPlotProps){
  return (
    <div className="lg:col-span-1">
        <div className="border border-gray-300 rounded-2xl shadow-sm p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm text-gray-500 mb-3 font-semibold">Cluster Plot</h4>
              <p className="text-xs text-gray-500">2D visualization of prompt clusters</p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[220px] flex items-center justify-center">
            {url ? (
              <div className="w-full h-full relative rounded-lg overflow-hidden border border-gray-50">
                <Image
                  src={url}
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
        </div>
      </div>
  )
}

interface TopClustersDetailsProps {
  topN?: number;
  topClusters: Cluster[];
  isViewAllVisible: boolean;
  onViewAllClusters: () => void;
}
function TopClustersDetails({ topN = 6, topClusters, isViewAllVisible, onViewAllClusters }: TopClustersDetailsProps) {
  const sortedClusters = topClusters.sort((a, b) => b.prototype_size - a.prototype_size)
  return (
    <div className="lg:col-span-3 border border-gray-300 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm text-gray-500 font-semibold">{`Top ${topN} Clusters`}</h3>
        </div>
        <div className='flex items-center gap-4'>
          
            {isViewAllVisible && (
          <button
            className="text-sm text-indigo-600 hover:underline"
            onClick={onViewAllClusters}
          >
            View all clusters
          </button>
        )}
          <FontAwesomeIcon
          icon={faLayerGroup}
          className="w-6 h-6 opacity-50"
        />
        </div>
      
      </div>

      {topClusters.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-400">No clusters yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Top cluster will be shown once prompts added
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {sortedClusters.map((cluster) => (
            <Link
              key={cluster.id}
              href={`/dashboard/clusters/cluster/${cluster.id}`}
              className="w-full"
            >
              <div className="w-full">
                <ClusterRow cluster={cluster} />
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
       <div className="text-xs text-gray-500">
          Similarity and similarity spread help you understand cluster cohesion
        </div>
      </div>
    </div>
  );
}
