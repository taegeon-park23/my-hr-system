import { AttendanceLog } from '../model/types';

const MOCK_LOGS: AttendanceLog[] = [
    { id: 1, date: '2024-12-01', checkIn: '08:55', checkOut: '18:05', status: 'NORMAL' },
    { id: 2, date: '2024-12-02', checkIn: '08:50', checkOut: '18:10', status: 'NORMAL' },
    { id: 3, date: '2024-12-03', checkIn: '09:15', checkOut: '18:00', status: 'LATE' },
    { id: 4, date: '2024-12-04', checkIn: '08:58', checkOut: '19:30', status: 'NORMAL' },
    { id: 5, date: '2024-12-05', checkIn: '', checkOut: '', status: 'VACATION' },
    // ... more data can be generated dynamically
];

export const getMonthlyAttendance = async (year: number, month: number): Promise<AttendanceLog[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_LOGS);
        }, 500);
    });
};
