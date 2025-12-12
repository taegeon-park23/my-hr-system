'use client';

import { useEffect, useState } from 'react';
import { getMonthlyAttendance } from '@/features/attendance/api/attendanceApi';
import { getMyVacationBalance } from '@/features/vacation/api/vacationApi';
import { AttendanceCalendar } from '@/features/attendance/ui/AttendanceCalendar';
import { VacationStatus } from '@/features/vacation/ui/VacationStatus';
import { AttendanceLog } from '@/features/attendance/model/types';
import { VacationBalance } from '@/features/vacation/model/types';
import { Button } from '@/shared/ui/Button';

export default function AttendancePage() {
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [balance, setBalance] = useState<VacationBalance | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [logsData, balanceData] = await Promise.all([
                    getMonthlyAttendance(2024, 12),
                    getMyVacationBalance(),
                ]);
                setLogs(logsData);
                setBalance(balanceData);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Attendance & Vacation
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Button>Check In</Button>
                </div>
            </div>

            {loading || !balance ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <VacationStatus balance={balance} />
                        <div className="mt-6 bg-white shadow rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">Quick Actions</h3>
                            <div className="mt-4 space-y-2">
                                <Button variant="secondary" className="w-full">Request Vacation</Button>
                                <Button variant="secondary" className="w-full">Correction Request</Button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <AttendanceCalendar logs={logs} />
                    </div>
                </div>
            )}
        </div>
    );
}
