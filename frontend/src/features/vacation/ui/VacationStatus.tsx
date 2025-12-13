import React from 'react';
import { VacationBalance } from '../api/vacationApi';

interface Props {
    balance: VacationBalance;
}

export const VacationStatus: React.FC<Props> = ({ balance }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900">Vacation Status</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-2xl font-bold text-green-600">{balance.remainingDays}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Used</p>
                    <p className="text-2xl font-bold text-gray-900">{balance.usedDays}</p>
                </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
                Total: {balance.totalDays} days
            </div>
        </div>
    );
};
