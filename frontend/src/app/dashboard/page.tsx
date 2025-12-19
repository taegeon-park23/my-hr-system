'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { NoticeWidget } from '@/widgets/Dashboard/NoticeWidget';
import { AttendanceChart } from '@/widgets/Dashboard/AttendanceChart';
import { QuickActionWidget } from '@/widgets/Dashboard/QuickActionWidget';
import { TeamVacationWidget } from '@/widgets/Dashboard/TeamVacationWidget';
import { QuickStats } from '@/widgets/Dashboard/QuickStats';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const formattedDate = currentTime.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Personalized Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-display">
                        안녕하세요, <span className="text-primary-600">{user?.name || '사용자'}</span>님
                    </h1>
                    <p className="text-slate-500 mt-1">오늘도 즐거운 하루 되세요!</p>
                </div>
                <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm text-right">
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{formattedDate}</p>
                    <p className="text-2xl font-bold text-slate-800 font-mono tracking-tighter">{formattedTime}</p>
                </div>
            </header>

            {/* Top Quick Stats */}
            <section>
                <QuickStats />
            </section>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Info */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="h-[400px]">
                        <NoticeWidget />
                    </section>
                    <section className="h-[350px]">
                        <AttendanceChart />
                    </section>
                </div>

                {/* Right Column: Actions & People */}
                <div className="space-y-8">
                    <section>
                        <QuickActionWidget />
                    </section>
                    <section>
                        <TeamVacationWidget />
                    </section>
                </div>
            </div>
        </div>
    );
}

