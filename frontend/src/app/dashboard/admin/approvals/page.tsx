'use client';

import React, { useState } from 'react';
import { useAdminApprovals, forceApprovalDecision } from '@/features/approval/api/approvalApi';
import { AdminApprovalList } from '@/features/approval/ui/AdminApprovalList';
import { useToast } from '@/shared/ui/Toast';
import { PageHeader } from '@/shared/ui/PageHeader';

export default function AdminApprovalPage() {
    const { data: requests, isLoading, mutate } = useAdminApprovals();
    const { showToast } = useToast();
    const [filter, setFilter] = useState('ALL');

    const handleForceDecision = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        const comment = window.prompt(`강제 ${status === 'APPROVED' ? '승인' : '반려'} 사유를 입력하세요:`);
        if (comment === null) return;

        try {
            await forceApprovalDecision(id, status, comment);
            showToast(`문서가 강제 ${status === 'APPROVED' ? '승인' : '반려'} 처리되었습니다.`, 'success');
            mutate();
        } catch (error) {
            showToast('처리에 실패했습니다.', 'error');
        }
    };

    const filteredRequests = requests.filter((r: any) => {
        if (filter === 'ALL') return true;
        return r.status === filter;
    });

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-display">결재 문서 통합 관리</h1>
                    <p className="text-slate-500 mt-1">사내의 모든 결재 문서를 모니터링하고 강제 처리할 수 있습니다.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s: string) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${filter === s ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {s === 'ALL' ? '전체' : s}
                        </button>
                    ))}
                </div>
            </header>

            <AdminApprovalList
                requests={filteredRequests}
                isLoading={isLoading}
                onForceDecision={handleForceDecision}
            />
        </div>
    );
}
