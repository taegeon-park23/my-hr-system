'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import useSWR from 'swr';
import { fetcher } from '@/shared/api/fetcher';

interface HiringAttritionStat {
    month: string;
    hiring: number;
    attrition: number;
}

export const HiringAttritionChart = () => {
    const { data: stats, isLoading } = useSWR<HiringAttritionStat[]>('/admin/stats/hiring-attrition', fetcher);

    if (isLoading) return <div className="h-64 bg-slate-50 animate-pulse rounded-2xl" />;

    const maxVal = Math.max(...(stats?.map((s: HiringAttritionStat) => Math.max(s.hiring, s.attrition)) || [10]));

    return (
        <Card className="p-6 h-full border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-800">입/퇴사 추이</h3>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                        <span className="text-slate-500">입사</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="text-slate-500">퇴사</span>
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between h-48 gap-2 px-2">
                {stats?.map((stat: HiringAttritionStat, idx: number) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full flex justify-center items-end gap-1 h-full">
                            {/* Hiring Bar */}
                            <div
                                className="w-2.5 bg-primary-500 rounded-t-sm transition-all duration-1000"
                                style={{ height: `${(stat.hiring / maxVal) * 100}%` }}
                                title={`입사: ${stat.hiring}명`}
                            />
                            {/* Attrition Bar */}
                            <div
                                className="w-2.5 bg-rose-400 rounded-t-sm transition-all duration-1000"
                                style={{ height: `${(stat.attrition / maxVal) * 100}%` }}
                                title={`퇴사: ${stat.attrition}명`}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{stat.month}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};
