import { Suspense } from 'react';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import ErrorComponent from "./error"
import Loading from "./loading"
import PromptsTableView from '@/app/ui/sereleum/prompts-table';

export const revalidate = 120;

export default async function Page() {
    return (
        <ErrorBoundary errorComponent={ErrorComponent}>
            <Suspense fallback={<Loading />}>
            <PromptsTableView pageSize={25}/>
            </Suspense>
        </ErrorBoundary>
    );
}
