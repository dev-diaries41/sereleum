'use client'
import  { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import { CollectionManagerView } from '@/app/ui/sereleum/collections/collection-manager-view';
import { CollectionType } from '@/app/enums/collections';
import { parseNumber } from '@/app/lib/helpers';

export default function Page(props:  { params: Promise<{ id: string }> }) {
  const params = useParams();
  const id = params?.id as string | undefined;
  const tagId = id? parseNumber(id) : undefined

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <CollectionManagerView id={tagId} type={CollectionType.TAG} />
      </Suspense>
    </ErrorBoundary>
  );
}
