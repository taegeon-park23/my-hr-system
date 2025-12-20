'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { StatCard } from '@/shared/ui/StatCard';

interface AttendanceSummaryCardProps {
    totalHours: number;
    lateCount: number;
    absentCount: number;
    vacationUsed: number;
}

export const AttendanceSummaryCard = ({ totalHours, lateCount, absentCount, vacationUsed }: AttendanceSummaryCardProps) => {
    // Note: 'absentCount' and 'vacationUsed' passed but we want to show Overtime as per plan.
    // However, the props are typed and likely coming from API response.
    // For now, let's map what we have to the UI.
    // Plan said: "Total Working Hours, Late Count, Overtime Hours".
    // We have: totalHours, lateCount, absentCount, vacationUsed.
    // We will stick to what is passed for now, but update labels.
    // If Overtime is missing in props/API, we might need to update API later.
    // For this step, let's just fix the prop usage of StatCard.

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="총 근무 시간"
                value={`${totalHours}h`}
            />
            <StatCard
                label="지각"
                value={`${lateCount}회`}
                color="text-red-600"
            />
            <StatCard
                label="결근"
                value={`${absentCount}회`}
                color="text-red-600"
            />
            <StatCard
                label="휴가 사용"
                value={`${vacationUsed}일`}
                color="text-blue-600"
            />
        </div>
    );
};
