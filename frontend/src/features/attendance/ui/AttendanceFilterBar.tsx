'use client';

import React from 'react';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';

interface AttendanceFilterBarProps {
    year: number;
    month: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
    viewMode: 'list' | 'calendar';
    onViewModeChange: (mode: 'list' | 'calendar') => void;
}

export const AttendanceFilterBar = ({
    year,
    month,
    onYearChange,
    onMonthChange,
    viewMode,
    onViewModeChange
}: AttendanceFilterBarProps) => {
    const years = Array.from({ length: 5 }, (_, i) => 2023 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-4">
                <Select
                    value={year.toString()}
                    onChange={(e) => onYearChange(parseInt(e.target.value))}
                    options={years.map(y => ({ value: y.toString(), label: `${y}년` }))}
                />
                <Select
                    value={month.toString()}
                    onChange={(e) => onMonthChange(parseInt(e.target.value))}
                    options={months.map(m => ({ value: m.toString(), label: `${m}월` }))}
                />
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => onViewModeChange('list')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    리스트
                </button>
                <button
                    onClick={() => onViewModeChange('calendar')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${viewMode === 'calendar' ? 'bg-white shadow text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    캘린더
                </button>
            </div>
        </div>
    );
};
