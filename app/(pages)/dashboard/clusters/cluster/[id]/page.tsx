import { Suspense } from 'react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from './error';
import Loading from './loading';
import { CollectionType } from '@/app/enums/collections';
import { CollectionManagerView } from '@/app/ui/sereleum/collections/collection-manager-view';
import { sereleumApiClient } from '@/app/sereleum';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = CollectionType.CLUSTER
  const collection = ( await sereleumApiClient.getCollections(type, 0, 1, id))[0]
  const items = await sereleumApiClient.getItems(type, [collection.id], 25)
  const totalClusters = await sereleumApiClient.countCollections(CollectionType.CLUSTER)

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <CollectionManagerView collectionToView={collection} type={type}  initialItems={items} totalCollections={totalClusters}/>
      </Suspense>
    </ErrorBoundary>
  );
}