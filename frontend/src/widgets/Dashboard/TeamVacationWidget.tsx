'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { useTeamVacations } from '@/features/vacation/api/vacationApi';

export const TeamVacationWidget = () => {
    const { teamVacations, isLoading } = useTeamVacations();

    return (
        <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">팀원 휴가 현황</h3>
            <div className="space-y-4">
                {isLoading ? (
                    [1, 2].map(i => <div key={i} className="h-10 bg-slate-50 animate-pulse rounded" />)
                ) : teamVacations.length > 0 ? (
                    teamVacations.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                    {item.userName?.[0] || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{item.userName}</p>
                                    <p className="text-xs text-slate-400">
                                        {item.startDate === item.endDate ? item.startDate : `${item.startDate} - ${item.endDate}`}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={item.type.includes('ANNUAL') ? 'primary' : 'secondary'}>
                                {item.type}
                            </Badge>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 text-center py-4">휴가 예정자가 없습니다.</p>
                )}
            </div>
        </Card>
    );
};

