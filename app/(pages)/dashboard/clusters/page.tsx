import { Suspense } from 'react';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { Cluster } from '@/app/types';
import { ClusterRow } from '@/app/ui/sereleum/clusters/cluster-row';
import { ClustersWrapper } from '@/app/ui/sereleum/clusters/clusters-lists';

interface ClustersPageProps {
  clusters: Cluster[];
}

export default function Page() {
  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <ClustersWrapper pageSize={25}/>
      </Suspense>
    </ErrorBoundary>
  );
}
