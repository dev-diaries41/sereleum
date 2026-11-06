'use client'
import  { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import { CollectionType } from '@/app/enums/collections';
import { CollectionManagerView } from '@/app/ui/sereleum/collections/collection-manager-view';

export default function Page(props:  { params: Promise<{ id: string }> }) {
  const params = useParams();
  const clusterId = params?.id as string | undefined;

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <CollectionManagerView id={clusterId} type={CollectionType.CLUSTER} />
      </Suspense>
    </ErrorBoundary>
  );
}
