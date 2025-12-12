import React, { useState } from 'react';
import { AttendanceLog } from '../model/types';

interface AttendanceCalendarProps {
    logs: AttendanceLog[];
}

export const AttendanceCalendar = ({ logs }: AttendanceCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Simplified calendar rendering for mockup
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getLogForDay = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return logs.find(log => log.date === dateStr);
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Attendance - {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                {days.map(day => {
                    const log = getLogForDay(day);
                    return (
                        <div key={day} className={`
                p-2 rounded-md border min-h-[60px] flex flex-col justify-between
                ${log?.status === 'LATE' ? 'bg-yellow-50 border-yellow-200' :
                                log?.status === 'ABSENT' ? 'bg-red-50 border-red-200' :
                                    log?.status === 'VACATION' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}
              `}>
                            <span className="font-bold">{day}</span>
                            {log && (
                                <div className="text-[10px]">
                                    <div>{log.checkIn}</div>
                                    <div>{log.checkOut}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
