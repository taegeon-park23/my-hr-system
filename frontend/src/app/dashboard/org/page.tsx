'use client';

import { useOrgTree } from '@/features/org/api/orgApi';
import { OrgTree } from '@/features/org/ui/OrgTree';
import { Button } from '@/shared/ui/Button';
import { ApiErrorFallback } from '@/shared/ui/ApiErrorFallback';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

export default function OrgPage() {
    const { data, isLoading, isError, mutate } = useOrgTree();

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Organization Management
                        </h2>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Button variant="secondary" className="mr-2">Export</Button>
                        <Button>Add Department</Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading organization structure...</p>
                    </div>
                ) : isError ? (
                    <ApiErrorFallback
                        error={isError}
                        title="조직도 로드 실패"
                        message="조직 데이터를 불러오는 중 오류가 발생했습니다. 백엔드 API가 아직 구현되지 않았을 수 있습니다."
                        onRetry={() => mutate()}
                    />
                ) : (
                    <OrgTree nodes={data} />
                )}
            </div>
        </ErrorBoundary>
    );
}

