import React, { Suspense } from 'react';
import AccountOverview from '@/app/ui/account/account';
import { auth } from '@/auth';
import Loading from './loading';
import ErrorComponent from './error';
import { getAllUsage } from '@/app/lib/server/data/usage';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;
    const credits = session?.user.credits;
    const usage = await getAllUsage(email!);
    
    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
                <AccountOverview usage={usage} email={email!} credits={credits!}/>
            </Suspense>
        </ErrorBoundary>
    );
}
