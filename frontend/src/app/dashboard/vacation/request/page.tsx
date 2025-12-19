'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { VacationRequestForm } from '@/features/vacation/ui/VacationRequestForm';
import { MyVacationStatusCard } from '@/features/vacation/ui/MyVacationStatusCard';
import { ApprovalLinePreview } from '@/features/approval/ui/ApprovalLinePreview';
import { useMyVacationBalance } from '@/features/vacation/api/vacationApi';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

import { useApprovalLinePreview } from '@/features/approval/api/approvalApi';

export default function VacationRequestPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { balance, isLoading: balanceLoading } = useMyVacationBalance(user?.id, new Date().getFullYear());
    const { line, isLoading: lineLoading } = useApprovalLinePreview();

    const steps = [
        { role: '기안', name: user?.name || '본인', status: 'APPROVED' as const },
        ...(line?.steps.map(s => ({
            role: s.stepOrder === 1 ? '팀장 승인' : '결재',
            name: s.approverName,
            status: 'PENDING' as const
        })) || [])
    ];


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-display">휴가 신청</h1>
                    <p className="text-sm text-slate-500 mt-1">새로운 휴가 계획을 등록하고 결재를 요청합니다.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => router.back()}>
                    <Icon name="ArrowLeftIcon" className="w-4 h-4 mr-1" />
                    돌아가기
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Form */}
                <div className="lg:col-span-2">
                    <VacationRequestForm />
                </div>

                {/* Right: Info Panel */}
                <div className="space-y-8">
                    {!balanceLoading && balance && (
                        <MyVacationStatusCard
                            remainingDays={balance.remainingDays}
                            usedDays={balance.usedDays}
                            totalDays={balance.totalDays}
                            pendingDays={0}
                        />
                    )}
                    {!lineLoading && <ApprovalLinePreview steps={steps} />}
                </div>
            </div>
        </div>
    );
}

