import  { Suspense } from 'react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import { CollectionManagerView } from '@/app/ui/sereleum/collections/collection-manager-view';
import { CollectionType } from '@/app/enums/collections';
import { parseNumber } from '@/app/lib/helpers';
import { apiClient } from '@/app/sereleum';


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const type = CollectionType.TAG
    const tagId = parseNumber(id)
    const collection = ( await apiClient.getCollections(type, 0, 1, tagId))[0]
    const items = await apiClient.getItems(type, [collection.id], 25)

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <CollectionManagerView collectionToView={collection} type={CollectionType.TAG} initialItems={items} />
      </Suspense>
    </ErrorBoundary>
  );
}
