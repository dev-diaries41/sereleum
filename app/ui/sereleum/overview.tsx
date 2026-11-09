'use client';

import {  OverviewInfo, User } from '@/app/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import FileUploader from '../common/upload';
import {  AcceptedMimes } from '@/app/constants/global';
import { ProgressTrackerPopUp } from '../common/progress-tracker';
import { OverviewSummary } from './overview-summary';
import {InlinePopUp} from '../common/inline-popup';
import useOnboarding from '@/app/hooks/useOnboarding';
import { Questionnaire } from '../onboarding/questionnaire';
import { ONBOARDING_WELCOME_MESSAGE, ONBOARDING_WELCOME_TITLE, onboardingQuestions } from '@/app/constants/content/onboarding';
import { TopCollectionsContainer } from './collections/top-collections';
import { CollectionType } from '@/app/enums/collections';
import { useDashboard } from '@/app/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import { viewCollection } from '@/app/lib/nav';

interface DashboardOverviewProps {
  initialOverview: OverviewInfo;
  user?: Partial<User>;
  hasCompletedOnboarding?: boolean;
}

export function DashboardOverview({user, hasCompletedOnboarding, initialOverview}: DashboardOverviewProps) {
  const {
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
  } = useDashboard(initialOverview)
  
  // const {isVisible, isOnboarded, onCompleteOnboarding} = useOnboarding(user?.email);

  const router = useRouter();

  return (
    <div className="flex-1 mx-auto w-full p-8">
      {/* {( !hasCompletedOnboarding && isVisible && !isOnboarded ) &&(
      <Questionnaire 
      onComplete={onCompleteOnboarding} 
      onboardingQuestions={onboardingQuestions} 
      welcomeMessage={ONBOARDING_WELCOME_MESSAGE} 
      welcomeTitle={ONBOARDING_WELCOME_TITLE}/>
      )} */}
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
                      Upload items
                    </button>
                  ) : (
                    <FileUploader
                      onFileUpload={(files) => updateItemsFile(files[0])}
                      acceptedMimes={AcceptedMimes}
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-md">
                        Add items
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
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
            <TopCollectionsContainer 
            type={CollectionType.CLUSTER}
            topCollections={overview.top_clusters} 
            isViewAllVisible ={isViewAllVisible } 
            onViewAllCollections={goToClustersPage}
            onCollectionClick={(collection) => viewCollection(router, collection)}
            />
          </div>
             <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopCollectionsContainer 
            type={CollectionType.TAG}
            topCollections={overview.top_tags} 
            isViewAllVisible ={isViewAllVisible } 
            onViewAllCollections={goToTagsPage}
            onCollectionClick={(collection) => viewCollection(router, collection)}
            />
          </div>
       
        </div>
        {indexingStatus  && <ProgressTrackerPopUp
          progress={progress} 
          status={indexingStatus} 
          title={"Indexing items"}
          minimized = {trackerMinimized}
          onMinimize={() => updateTrackerVisibility(true)}
          />
          }

        {clusteringStatus && <ProgressTrackerPopUp
          status={clusteringStatus} 
          title={"Clustering items"}
          minimized = {trackerMinimized}
          description="Clustering is in progress. This may take a while depending on the number of items."
          onMinimize={() => updateTrackerVisibility(true)}
          />
        }
      </div>
    );
  }
