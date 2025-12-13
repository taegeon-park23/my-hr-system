import React from 'react';

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
    // Mock data for now, ideally fetched
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard label="Remaining Vacation" value="12 Days" color="text-green-600" />
            <StatCard label="Pending Approvals" value="3" color="text-yellow-600" />
            <StatCard label="Payslip (Dec)" value="Available" color="text-blue-600" />
            <StatCard label="Team Members" value="8" />
        </div>
    );
};
