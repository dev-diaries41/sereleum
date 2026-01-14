import { Suspense } from 'react';
import { auth } from '@/auth';
import { getPromptOverView } from '@/app/lib/server/data/prompts';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import { ClusterAccuracyPlayground } from '@/app/ui/revelium/cluster-accuracy';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;
    const credits = session?.user.credits;
    const promptOverview = await getPromptOverView(email!);
    
    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
            <ClusterAccuracyPlayground/>
            </Suspense>
        </ErrorBoundary>
    );
}
