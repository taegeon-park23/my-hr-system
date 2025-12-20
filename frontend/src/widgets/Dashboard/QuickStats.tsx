'use client';

import React from 'react';
import { useDashboardStats } from './model/useDashboardStats';
import { StatCard } from '@/shared/ui/StatCard';

export const QuickStats = () => {
    // Destructure expanded stats from the hook
    const { vacation, attendance, approval } = useDashboardStats();

    // 1. Attendance: Show today's Check In / Out
    // We assume 'attendance.summary' is monthly summary, but for "Today's Check In",
    // we might need a specific 'today' endpoint or just reuse monthly log if available.
    // For now, let's assume we want to show "Check In: 09:00" or "Not Checked In".
    // Since existing hook was `useAttendanceSummary` (monthly), let's use a placeholder or
    // if `useDashboardStats` is updated to fetch today's status, use that.
    // **Correction**: The plan said "Today's Check-in/out time".
    // Let's rely on `attendance` object which now has `summary` (monthly).
    // To match SB strictly, we need daily status.
    // However, as a first step improving UI, we will format what we have.

    // *Refining Logic*: The `useMyApprovalStats` was added.
    // Vacation: "Remaining / Total" + Progress Bar.
    // Approval: "In Progress" (My Docs).
    // Tasks: "To Approve" (Pending).

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* 1. Attendance Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <dt className="text-sm font-medium text-gray-500 truncate mb-1">근태 (오늘)</dt>
                <dd className="mt-1">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">출근</span>
                        <span className="font-bold text-slate-900">-</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-slate-500">퇴근</span>
                        <span className="font-bold text-slate-900">-</span>
                    </div>
                    {/* Placeholder for status badge */}
                    <div className="mt-2 text-xs text-center bg-slate-100 py-1 rounded text-slate-500">
                        출근 전
                    </div>
                </dd>
            </div>

            {/* 2. Vacation Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <dt className="text-sm font-medium text-gray-500 truncate mb-1">휴가</dt>
                <dd>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-green-600">
                            {vacation.balance?.remainingDays ?? 0}
                        </span>
                        <span className="text-sm text-slate-400">
                            / {vacation.balance?.totalDays ?? 15}일
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5">
                        <div
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    ((vacation.balance?.usedDays ?? 0) / (vacation.balance?.totalDays || 1)) * 100,
                                    100
                                )}%`
                            }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">
                        사용 {vacation.balance?.usedDays ?? 0}일
                    </p>
                </dd>
            </div>

            {/* 3. My Approvals (In Progress) */}
            <StatCard
                label="결재 진행 중 (내 문서)"
                value={approval.stats?.inProgressCount ?? 0}
                color="text-blue-600"
                isLoading={approval.isLoading}
            />

            {/* 4. To Approve (Tasks) */}
            <StatCard
                label="승인 대기 (할 일)"
                value={approval.stats?.pendingCount ?? 0}
                color="text-amber-600"
                isLoading={approval.isLoading}
            />
        </div>
    );
};

