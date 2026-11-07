import { Suspense } from 'react';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { sereleumApiClient } from '@/app/sereleum';
import { CollectionsWrapper } from '@/app/ui/sereleum/collections/collections-lists';
import { CollectionType } from '@/app/enums/collections';

export default async function Page() {
  
  const collections = await sereleumApiClient.getCollections(CollectionType.TAG, 0, 25)
  const totalTags = await sereleumApiClient.countCollections(CollectionType.TAG)

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <CollectionsWrapper pageSize={25} initialCollections={collections} type={CollectionType.TAG} totalCollections={totalTags}/>
      </Suspense>
    </ErrorBoundary>
  );
}
