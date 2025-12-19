'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';

interface MyVacationStatusCardProps {
    remainingDays: number;
    usedDays: number;
    totalDays: number;
    pendingDays?: number;
}

export const MyVacationStatusCard = ({ remainingDays, usedDays, totalDays, pendingDays = 0 }: MyVacationStatusCardProps) => {
    return (
        <Card className="p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Icon name="CalendarIcon" className="w-24 h-24" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <Icon name="CalendarIcon" className="w-5 h-5 mr-2 text-primary-500" />
                나의 연차 현황
            </h3>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-slate-500">잔여 연차</span>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-primary-600">{remainingDays}</span>
                            <span className="text-lg font-medium text-slate-400"> / {totalDays}</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${(remainingDays / totalDays) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1 font-medium">사용 연차</p>
                        <p className="text-xl font-bold text-slate-700">{usedDays}일</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 mb-1 font-medium">사용 예정</p>
                        <p className="text-xl font-bold text-blue-700">{pendingDays}일</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                    * 연차 정보는 실시간 결재 현황에 따라 차이가 있을 수 있습니다.
                </p>
            </div>
        </Card>
    );
};
