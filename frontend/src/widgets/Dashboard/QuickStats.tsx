import React from 'react';
import { useDashboardStats } from '@/shared/hooks/useDashboardStats';

interface StatProps {
    label: string;
    value: string | number;
    color?: string;
}

const StatCard = ({ label, value, color = "text-gray-900" }: StatProps) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
            <dd className={`mt-1 text-3xl font-semibold ${color}`}>{value}</dd>
        </div>
    </div>
);

export const QuickStats = () => {
    const { vacation, pendingTasks, payslip, team } = useDashboardStats();

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard label="Remaining Vacation" value={vacation.display} color="text-success-600" />
            <StatCard label="Pending Evaluations" value={pendingTasks.count} color="text-warning-600" />
            <StatCard label="Payslip (Dec)" value={payslip.status} color="text-info-600" />
            <StatCard label="Team Members" value={team.count} />
        </div>
    );
};

