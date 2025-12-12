export interface AttendanceLog {
    id: number;
    date: string; // YYYY-MM-DD
    checkIn: string; // HH:mm
    checkOut: string; // HH:mm
    status: 'NORMAL' | 'LATE' | 'ABSENT' | 'VACATION';
}
