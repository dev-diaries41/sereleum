import { Suspense } from 'react';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { CollectionsWrapper } from '@/app/ui/sereleum/collections/collections-lists';
import { apiClient } from '@/app/sereleum';
import { CollectionType } from '@/app/enums/collections';

export default async function Page() {
  
  const collections = await apiClient.getCollections(CollectionType.CLUSTER, 0, 25)
  const totalClusters = await apiClient.countCollections(CollectionType.CLUSTER)

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <CollectionsWrapper pageSize={25} initialCollections={collections} type={CollectionType.CLUSTER} totalCollections={totalClusters}/>
      </Suspense>
    </ErrorBoundary>
  );
}
