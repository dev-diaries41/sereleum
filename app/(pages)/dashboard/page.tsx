import  { Suspense } from 'react';
import DashboardOverview from '@/app/ui/dashboard/overview';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { reveliumClient } from '@/app/revelium/client';
import { convertSnakeToCamel } from '@/app/lib/helpers';

export const revalidate = 120;

export default async function Page() {
    const promptOverview = await reveliumClient.getPromptsOverview();
    const clusters = await reveliumClient.getClusters();

    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <DashboardOverview overview={convertSnakeToCamel(promptOverview)} clusters={clusters}/>
            </Suspense>
        </ErrorBoundary>
    );
}
