'use client';

import React, { useState } from 'react';
import { useOrgTree } from '@/features/org/api/orgApi';
import { OrgTree } from '@/features/org/ui/OrgTree';
import { OrgDetailPanel } from '@/features/org/ui/OrgDetailPanel';
import { Button } from '@/shared/ui/Button';
import { ApiErrorFallback } from '@/shared/ui/ApiErrorFallback';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Department } from '@/features/org/model/types';

export default function OrgPage() {
    const user = useAuthStore((state: any) => state.user);
    const { data: treeData, isLoading, isError, mutate } = useOrgTree(user?.companyId);
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);

    return (
        <ErrorBoundary>
            <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 font-display">조직도 관리</h1>
                        <p className="text-slate-500 mt-1">부서 구조를 관리하고 각 부서의 구성원을 지정합니다.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary">데이터 내보내기</Button>
                        <Button>신규 부서 생성</Button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6">
                    {/* Left: Tree Side */}
                    <div className="md:w-1/3 lg:w-1/4 h-full overflow-auto">
                        {isLoading ? (
                            <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-sm text-slate-500 font-medium">조직도 불러오는 중...</p>
                            </div>
                        ) : isError ? (
                            <ApiErrorFallback
                                error={isError}
                                title="조직도 로드 실패"
                                message="조직 데이터를 불러오는 중 오류가 발생했습니다."
                                onRetry={() => mutate()}
                            />
                        ) : (
                            <OrgTree
                                nodes={treeData || []}
                                selectedId={selectedDept?.id}
                                onSelect={setSelectedDept}
                            />
                        )}
                    </div>

                    {/* Right: Detail Side */}
                    <div className="flex-1 h-full min-h-0">
                        <OrgDetailPanel department={selectedDept} />
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}

