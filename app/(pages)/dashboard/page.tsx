import  { Suspense } from 'react';
import  {DashboardOverview} from '@/app/ui/sereleum/overview';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { auth } from '@/auth';
import { UserMetadata } from '@/app/types';
import { MVPDashboard } from '@/app/ui/sereleum/mvp-upload';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;
    const metadata = session?.user?.metadata as UserMetadata;
    const stage = process.env.NEXT_PUBLIC_APP_STAGE;

    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
            {stage === "mvp"? (
                <MVPDashboard email={email} hasCompletedOnboarding = {metadata?.hasCompletedOnboarding}/>
            ):(
                 <DashboardOverview email={email} hasCompletedOnboarding = {metadata?.hasCompletedOnboarding}/>
                )
            }
            </Suspense>
        </ErrorBoundary>
    );
}
