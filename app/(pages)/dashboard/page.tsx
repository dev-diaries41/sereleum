import React, { Suspense } from 'react';
import DashboardOverview from '@/app/ui/dashboard/overview';
import { auth } from '@/auth';
import Loading from './loading';
import ErrorComponent from './error';
import { getPromptOverView } from '@/app/lib/server/data/prompts';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;
    const credits = session?.user.credits;
    const promptOverview = await getPromptOverView(email!);
    
    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <DashboardOverview overview={promptOverview} email={email!} credits={credits!}/>
            </Suspense>
        </ErrorBoundary>
    );
}
