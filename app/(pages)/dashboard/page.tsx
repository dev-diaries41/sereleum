import  { Suspense } from 'react';
import  {DashboardOverview} from '@/app/ui/sereleum/overview';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

export const revalidate = 120;

export default async function Page() {
   
    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <DashboardOverview/>
            </Suspense>
        </ErrorBoundary>
    );
}
