'use client';

import React from 'react';
import { useDashboardStats } from './model/useDashboardStats';
import { StatCard } from '@/shared/ui/StatCard';

export const ManagerStats = () => {
    const { summary } = useDashboardStats();

    if (!summary.show || !summary.data) return null;

    const data = summary.data;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Organization Overview</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Employees"
                    value={data.totalEmployees}
                    color="text-slate-600"
                    isLoading={summary.isLoading}
                />
                <StatCard
                    label="Today's Attendance"
                    value={data.todayAttendance}
                    color="text-green-600"
                    isLoading={summary.isLoading}
                />
                <StatCard
                    label="Pending Approvals"
                    value={data.pendingApprovals}
                    color="text-orange-600"
                    isLoading={summary.isLoading}
                />
                <StatCard
                    label="Rejected (Last 30d)"
                    value={data.rejectedApprovals}
                    color="text-rose-600"
                    isLoading={summary.isLoading}
                />
            </div>
        </div>
    );
};
