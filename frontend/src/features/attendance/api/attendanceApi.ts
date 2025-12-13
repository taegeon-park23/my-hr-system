import { client } from '@/shared/api/client';
import { AttendanceLog } from '../model/types';

export const checkIn = async (workType: string = 'NORMAL', ipAddress: string = '127.0.0.1'): Promise<void> => {
    await client.post('/attendance/check-in', {
        workType,
        ipAddress
    });
};

export const checkOut = async (): Promise<void> => {
    await client.post('/attendance/check-out');
};

export const getMonthlyAttendance = async (year: number, month: number): Promise<AttendanceLog[]> => {
    // Current backend doesn't support monthly query yet.
    // Return empty list or mock until Backend Phase 4 (Query Module)
    return [];
};

