import useSWR from 'swr';
import { client } from '@/shared/api/client';
import { AttendanceLog } from '../model/types';

export interface AttendanceSummary {
    totalHours: number;
    lateCount: number;
    absentCount: number;
    vacationUsed: number;
}

export const checkIn = async (workType: string = 'NORMAL', ipAddress: string = '127.0.0.1'): Promise<void> => {
    await client.post('/attendance/check-in', {
        workType,
        ipAddress
    });
};

export const checkOut = async (): Promise<void> => {
    await client.post('/attendance/check-out');
};

export const useMonthlyAttendance = (year: number, month: number) => {
    return useSWR<AttendanceLog[]>(
        `/attendance/my?year=${year}&month=${month}`,
        (url) => client.get(url).then(res => res.data)
    );
};

export const useAttendanceSummary = (year: number, month: number) => {
    return useSWR<AttendanceSummary>(
        `/attendance/summary?year=${year}&month=${month}`,
        (url) => client.get(url).then(res => res.data)
    );
};

