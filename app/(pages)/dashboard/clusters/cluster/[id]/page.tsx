'use client'
import  { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import { ClusterDetail } from '@/app/ui/sereleum/cluster-details';

export default function Page(props:  { params: Promise<{ id: string }> }) {
  const params = useParams();
  const id = params?.id as string | undefined;

  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <ClusterDetail id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
