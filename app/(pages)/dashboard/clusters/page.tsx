import { Suspense } from 'react';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { Cluster } from '@/app/types';
import { ClusterRow } from '@/app/ui/revelium/cluster-row';
import { ClustersWrapper } from '@/app/ui/revelium/clusters-lists';

interface ClustersPageProps {
  clusters: Omit<Cluster, 'embedding'>[];
}

export default function Page() {
  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <ClustersWrapper/>
      </Suspense>
    </ErrorBoundary>
  );
}
