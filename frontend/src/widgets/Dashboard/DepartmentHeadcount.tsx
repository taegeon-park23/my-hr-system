'use client';

import React from 'react';
import { useDepartmentStats } from '@/features/dashboard/api/dashboardApi';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export const DepartmentHeadcount = () => {
    const { user } = useAuthStore();
    const { stats, isLoading } = useDepartmentStats();

    if (user?.role === 'USER') return null;

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Headcount by Department</h3>
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 bg-gray-100 rounded w-full" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {stats.map((stat) => {
                        const maxCount = Math.max(...stats.map(s => s.headcount), 1);
                        const percentage = (stat.headcount / maxCount) * 100;

                        return (
                            <div key={stat.deptId} className="relative">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">{stat.deptName}</span>
                                    <span className="text-sm font-semibold text-gray-900">{stat.headcount}</span>
                                </div>
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                                    <div
                                        style={{ width: `${percentage}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
