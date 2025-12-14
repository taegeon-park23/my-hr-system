'use client';

import React from 'react';
import { useDashboardStats } from './model/useDashboardStats';
import { StatCard } from '@/shared/ui/StatCard';

export const QuickStats = () => {
    const { vacation, pendingTasks, payslip, team } = useDashboardStats();

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
                label="Remaining Vacation"
                value={vacation.balance ? `${vacation.balance.remainingDays} Days` : "0 Days"}
                color="text-success-600"
                isLoading={vacation.isLoading}
            />
            <StatCard
                label="Pending Evaluations"
                value={pendingTasks.count}
                color="text-warning-600"
                isLoading={pendingTasks.isLoading}
            />
            <StatCard
                label="Payslip (Latest)"
                value={payslip.data ? "Available" : "No record"}
                color="text-info-600"
                isLoading={payslip.isLoading}
            />
            <StatCard
                label="Team Members"
                value={team.count}
                isLoading={team.isLoading}
            />
        </div>
    );
};

