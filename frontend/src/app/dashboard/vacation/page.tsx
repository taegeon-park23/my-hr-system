"use client";

import React from 'react';
import { APP_CONFIG } from '@/shared/config/constants';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMyVacationBalance, useMyVacationRequests } from '@/features/vacation/api/vacationApi';
import { VacationBalanceCard } from '@/features/vacation/ui/VacationBalanceCard';
import { VacationRequestList } from '@/features/vacation/ui/VacationRequestList';
import { PageHeader } from '@/shared/ui/PageHeader';

export default function VacationPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const { balance, isLoading: isBalanceLoading } = useMyVacationBalance(user?.id, APP_CONFIG.CURRENT_YEAR);

    const { requests, isLoading: isRequestsLoading } = useMyVacationRequests(user?.id);

    const isLoading = isBalanceLoading || isRequestsLoading;

    return (
        <div className="p-8">
            <PageHeader
                title="휴가 관리"
                action={
                    <button
                        onClick={() => router.push('/dashboard/vacation/request')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        휴가 신청
                    </button>
                }
            />

            <VacationBalanceCard balance={balance || null} isLoading={isLoading} />

            <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">신청 내역</h2>
            <VacationRequestList requests={requests} isLoading={isLoading} />
        </div>
    );
}
