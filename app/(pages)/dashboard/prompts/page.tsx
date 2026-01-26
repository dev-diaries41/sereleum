import { Suspense } from 'react';
import { auth } from '@/auth';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import PromptsTableView from '@/app/ui/sereleum/prompts-table';
import { sereleumClient } from '@/app/sereleum/client';

export const revalidate = 120;

export default async function Page() {
    const session = await auth();
    const email = session?.user.email;
    const credits = session?.user.credits;
        
    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
            <PromptsTableView pageSize={25}/>
            </Suspense>
        </ErrorBoundary>
    );
}
