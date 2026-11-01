import { Suspense } from 'react';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { ClustersWrapper } from '@/app/ui/sereleum/clusters/clusters-lists';

export default function Page() {
  return (
    <ErrorBoundary errorComponent={ErrorComponent}>
      <Suspense fallback={<Loading />}>
        <ClustersWrapper pageSize={25}/>
      </Suspense>
    </ErrorBoundary>
  );
}
