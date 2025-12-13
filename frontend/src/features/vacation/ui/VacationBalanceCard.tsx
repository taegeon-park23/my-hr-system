import React from 'react';
import { VacationBalance } from '../model/types';

interface Props {
    balance: VacationBalance | null;
    isLoading: boolean;
}

export const VacationBalanceCard: React.FC<Props> = ({ balance, isLoading }) => {
    if (isLoading) {
        return <div className="p-6 bg-white rounded-lg shadow animate-pulse h-32">Loading...</div>;
    }

    if (!balance) {
        return <div className="p-6 bg-white rounded-lg shadow">데이터가 없습니다.</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-6 bg-white rounded-lg shadow text-center">
                <p className="text-gray-500 text-sm">총 연차</p>
                <p className="text-2xl font-bold text-gray-800">{balance.totalDays}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow text-center">
                <p className="text-gray-500 text-sm">사용 연차</p>
                <p className="text-2xl font-bold text-blue-600">{balance.usedDays}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow text-center">
                <p className="text-gray-500 text-sm">잔여 연차</p>
                <p className="text-2xl font-bold text-green-600">{balance.remainingDays}</p>
            </div>
        </div>
    );
};
