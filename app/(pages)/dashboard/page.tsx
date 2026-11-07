import  { Suspense } from 'react';
import  {DashboardOverview} from '@/app/ui/sereleum/overview';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { auth } from '@/auth';
import { User, UserMetadata } from '@/app/types';
import { sereleumApiClient } from '@/app/sereleum';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const user = session?.user as Partial<User>;
    const metadata = user?.metadata as UserMetadata;

    const overview = await sereleumApiClient.getOverview()

    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <DashboardOverview initialOverview={overview} user={user} hasCompletedOnboarding = {metadata?.hasCompletedOnboarding}/>
            </Suspense>
        </ErrorBoundary>
    );
}
