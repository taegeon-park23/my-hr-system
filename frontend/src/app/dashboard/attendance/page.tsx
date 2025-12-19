'use client';

import React, { useEffect, useState } from 'react';
import { getMonthlyAttendance } from '@/features/attendance/api/attendanceApi';
import { AttendanceFilterBar } from '@/features/attendance/ui/AttendanceFilterBar';
import { AttendanceSummaryCard } from '@/features/attendance/ui/AttendanceSummaryCard';
import { AttendanceCalendar } from '@/features/attendance/ui/AttendanceCalendar';
import { CorrectionModal } from '@/features/attendance/ui/CorrectionModal';
import { AttendanceLog } from '@/features/attendance/model/types';
import { Button } from '@/shared/ui/Button';
import { Table } from '@/shared/ui/Table';
import { Badge } from '@/shared/ui/Badge';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { ApiErrorFallback } from '@/shared/ui/ApiErrorFallback';

import { useMonthlyAttendance, useAttendanceSummary } from '@/features/attendance/api/attendanceApi';

export default function AttendancePage() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const { data: logs, isLoading: loading, isError: error, mutate } = useMonthlyAttendance(year, month);
    const { data: summary, isLoading: summaryLoading } = useAttendanceSummary(year, month);

    const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);


    const handleCorrectionRequest = (log: AttendanceLog) => {
        setSelectedLog(log);
        setIsCorrectionModalOpen(true);
    };

    const columns = [
        { header: '일자', accessor: (row: AttendanceLog) => row.date },
        { header: '출근 시간', accessor: (row: AttendanceLog) => row.checkIn || '-' },
        { header: '퇴근 시간', accessor: (row: AttendanceLog) => row.checkOut || '-' },
        {
            header: '상태',
            accessor: (row: AttendanceLog) => (
                <Badge variant={row.checkIn && row.checkOut ? 'primary' : 'secondary'}>
                    {row.checkIn && row.checkOut ? '정상' : '이상'}
                </Badge>
            )
        },
        {
            header: '작업',
            accessor: (row: AttendanceLog) => (
                <Button size="sm" variant="secondary" onClick={() => handleCorrectionRequest(row)}>
                    수정 요청
                </Button>
            )
        }
    ];


    return (
        <ErrorBoundary>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 font-display">근태 관리</h1>
                        <p className="text-sm text-slate-500 mt-1">월간 출퇴근 기록 및 근무 시간을 확인합니다.</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={() => alert('출근 체크!')}>출근하기</Button>
                        <Button variant="secondary" onClick={() => alert('퇴근 체크!')}>퇴근하기</Button>
                    </div>
                </div>

                <AttendanceSummaryCard
                    totalHours={summary?.totalHours || 0}
                    lateCount={summary?.lateCount || 0}
                    absentCount={summary?.absentCount || 0}
                    vacationUsed={summary?.vacationUsed || 0}
                />


                <AttendanceFilterBar
                    year={year}
                    month={month}
                    onYearChange={setYear}
                    onMonthChange={setMonth}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                {error ? (
                    <ApiErrorFallback
                        error={error}
                        title="출퇴근 기록 로드 실패"
                        onRetry={() => window.location.reload()}
                    />
                ) : loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {viewMode === 'list' ? (
                            <Table data={logs} columns={columns} />
                        ) : (
                            <div className="p-4">
                                <AttendanceCalendar logs={logs} />
                            </div>
                        )}
                    </div>
                )}

                <CorrectionModal
                    isOpen={isCorrectionModalOpen}
                    onClose={() => setIsCorrectionModalOpen(false)}
                    initialData={selectedLog ? {
                        date: selectedLog.date,
                        checkIn: selectedLog.checkIn || '',
                        checkOut: selectedLog.checkOut || ''
                    } : undefined}
                />

            </div>
        </ErrorBoundary>
    );
}



