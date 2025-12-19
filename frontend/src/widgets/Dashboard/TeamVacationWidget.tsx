'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';

const teamVacations = [
    { id: 1, name: '김철수', type: '연차', period: '12.19 - 12.20' },
    { id: 2, name: '이영희', type: '반차', period: '12.19 (PM)' },
    { id: 3, name: '박지민', type: '연차', period: '12.21 - 12.24' },
];

export const TeamVacationWidget = () => {
    return (
        <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">팀원 휴가 현황</h3>
            <div className="space-y-4">
                {teamVacations.length > 0 ? (
                    teamVacations.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                    {item.name[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.period}</p>
                                </div>
                            </div>
                            <Badge variant={item.type === '연차' ? 'primary' : 'secondary'}>
                                {item.type}
                            </Badge>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 text-center py-4">금주 휴가 예정자가 없습니다.</p>
                )}
            </div>
        </Card>
    );
};
