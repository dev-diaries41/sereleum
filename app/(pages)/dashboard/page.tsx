import  { Suspense } from 'react';
import Loading from './loading';
import ErrorComponent from './error';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { auth } from '@/auth';
import { User, UserMetadata } from '@/app/types';
import { MVPDashboard } from '@/app/ui/sereleum/mvp-upload';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const user = session?.user as Partial<User>;
    const metadata = user?.metadata as UserMetadata;

    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <MVPDashboard user={user} hasCompletedOnboarding = {metadata?.hasCompletedOnboarding}/>
            </Suspense>
        </ErrorBoundary>
    );
}
