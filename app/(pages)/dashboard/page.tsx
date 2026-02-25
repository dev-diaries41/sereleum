import  { Suspense } from 'react';
import  {DashboardOverview} from '@/app/ui/sereleum/overview';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { auth } from '@/auth';
import { UserMetadata } from '@/app/types';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;
    const metadata = session?.user?.metadata as UserMetadata;

    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <DashboardOverview email={email} hasCompletedOnboarding = {metadata?.hasCompletedOnboarding}/>
            </Suspense>
        </ErrorBoundary>
    );
}
