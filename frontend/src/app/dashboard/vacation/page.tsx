"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { vacationApi, VacationBalance, VacationRequest } from '@/features/vacation/api/vacationApi';
import { VacationBalanceCard } from '@/features/vacation/ui/VacationBalanceCard';
import { VacationRequestList } from '@/features/vacation/ui/VacationRequestList';

export default function VacationPage() {
    const router = useRouter();
    const [balance, setBalance] = useState<VacationBalance | null>(null);
    const [requests, setRequests] = useState<VacationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const userId = 1; // Mock User

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balanceData, requestsData] = await Promise.all([
                    vacationApi.getMyBalance(2025, userId),
                    vacationApi.getMyRequests(userId)
                ]);
                setBalance(balanceData);
                setRequests(requestsData);
            } catch (error) {
                console.error("Failed to fetch vacation data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">휴가 관리</h1>
                <button
                    onClick={() => router.push('/dashboard/vacation/request')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    휴가 신청
                </button>
            </div>

            <VacationBalanceCard balance={balance} isLoading={isLoading} />

            <h2 className="text-xl font-semibold text-gray-800 mb-4">신청 내역</h2>
            <VacationRequestList requests={requests} isLoading={isLoading} />
        </div>
    );
}
