import  { Suspense } from 'react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import { CollectionManagerView } from '@/app/ui/sereleum/collections/collection-manager-view';
import { CollectionType } from '@/app/enums/collections';
import { parseNumber } from '@/app/lib/helpers';
import { sereleumApiClient } from '@/app/sereleum';


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const type = CollectionType.TAG
    const tagId = parseNumber(id)
    const collection = ( await sereleumApiClient.getCollections(type, 0, 1, tagId))[0]
    const items = await sereleumApiClient.getItems(type, [collection.id], 25)
    const totalTags = await sereleumApiClient.countCollections(CollectionType.TAG)

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <CollectionManagerView collectionToView={collection} type={CollectionType.TAG} initialItems={items} initialTotalCollections={totalTags}/>
      </Suspense>
    </ErrorBoundary>
  );
}
