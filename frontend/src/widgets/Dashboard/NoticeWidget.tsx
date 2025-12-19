'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { useAnnouncements } from '@/features/dashboard/api/dashboardApi';

export const NoticeWidget = () => {
    const { announcements, isLoading } = useAnnouncements();

    return (
        <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">공지사항</h3>
                <button className="text-sm text-primary-600 hover:underline">전체보기</button>
            </div>
            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-50 animate-pulse rounded" />)
                ) : (
                    announcements.map((notice) => (
                        <div key={notice.id} className="flex items-start space-x-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="mt-1">
                                <Icon name="ChatBubbleLeftEllipsisIcon" className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700 line-clamp-1 hover:text-primary-600 cursor-pointer">
                                    {notice.title}
                                </p>
                                <span className="text-xs text-slate-400">
                                    {new Date(notice.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

