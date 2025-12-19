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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="총 근무 시간"
                value={`${totalHours}h`}
                description="이번 달 유효 근무 시간"
            />
            <StatCard
                title="지각"
                value={`${lateCount}회`}
                description="지차/조퇴 포함"
                trend="down"
            />
            <StatCard
                title="결근"
                value={`${absentCount}회`}
                description="미승인 결근"
            />
            <StatCard
                title="휴가 사용"
                value={`${vacationUsed}일`}
                description="당월 소진 연차"
            />
        </div>
    );
};
