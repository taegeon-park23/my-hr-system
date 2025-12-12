import React from 'react';
import { VacationBalance } from '../model/types';

interface VacationStatusProps {
    balance: VacationBalance;
    isLoading?: boolean;
}

export const VacationStatus = ({ balance, isLoading }: VacationStatusProps) => {
    if (isLoading) return <div className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>;

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Remaining Vacation Days</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{balance.remainingDays}</dd>
                <div className="mt-4">
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                            <div
                                style={{ width: `${(balance.usedDays / balance.totalDays) * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Used: {balance.usedDays}</span>
                            <span>Total: {balance.totalDays}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
