'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { Icon, IconName } from '@/shared/ui/Icon';

interface ActionItem {
    label: string;
    icon: IconName;
    href: string;
    color: string;
}

const actions: ActionItem[] = [
    { label: '휴가 신청', icon: 'CalendarDaysIcon', href: '/dashboard/vacation/request', color: 'bg-blue-50 text-blue-600' },
    { label: '근태 수정', icon: 'ClockIcon', href: '/dashboard/attendance', color: 'bg-indigo-50 text-indigo-600' },
    { label: '결재 대기', icon: 'ClipboardDocumentCheckIcon', href: '/dashboard/approval', color: 'bg-emerald-50 text-emerald-600' },
    { label: '급여 명세서', icon: 'CurrencyDollarIcon', href: '/dashboard/payroll', color: 'bg-amber-50 text-amber-600' },
    { label: '조직도', icon: 'UserGroupIcon', href: '/dashboard/org', color: 'bg-purple-50 text-purple-600' },
    { label: '증명서 발급', icon: 'DocumentTextIcon', href: '/dashboard/settings', color: 'bg-slate-50 text-slate-600' },
];

export const QuickActionWidget = () => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">빠른 실행</h3>
            <div className="grid grid-cols-3 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="flex flex-col items-center group transition-transform hover:-translate-y-1"
                    >
                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-2 group-hover:shadow-md transition-shadow`}>
                            <Icon name={action.icon} className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-slate-600 text-center">{action.label}</span>
                    </Link>
                ))}
            </div>
        </Card>
    );
};
