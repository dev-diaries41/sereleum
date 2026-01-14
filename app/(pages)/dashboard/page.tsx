import  { Suspense } from 'react';
import DashboardOverview, { DashboardOverviewWrapper } from '@/app/ui/dashboard/overview';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { reveliumClient } from '@/app/revelium/client';
import { convertSnakeToCamel } from '@/app/lib/helpers';

export const revalidate = 120;

export default async function Page() {
    const promptOverview = await reveliumClient.getPromptsOverview();
    const clusters = await reveliumClient.getClusters();
    const blob = await reveliumClient.getClusterPlotBlob()
    const imgUrl = URL.createObjectURL(blob);
    console.log(imgUrl)

    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <DashboardOverviewWrapper overview={convertSnakeToCamel(promptOverview)} clusters={clusters}/>
            </Suspense>
        </ErrorBoundary>
    );
}
