'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';

const notices = [
    { id: 1, title: '2024년 연차 촉진제 시행 안내', date: '2025-12-18', category: 'Notice' },
    { id: 2, title: '사내 보안 교육 이수 안내', date: '2025-12-15', category: 'Event' },
    { id: 3, title: '[복지] 구내식당 식단표 (12월 3주차)', date: '2025-12-14', category: 'Info' },
    { id: 4, title: '연말 정산 서류 제출 안내', date: '2025-12-10', category: 'Admin' },
];

export const NoticeWidget = () => {
    return (
        <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">공지사항</h3>
                <button className="text-sm text-primary-600 hover:underline">전체보기</button>
            </div>
            <div className="space-y-4">
                {notices.map((notice) => (
                    <div key={notice.id} className="flex items-start space-x-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="mt-1">
                            <Icon name="ChatBubbleLeftEllipsisIcon" className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700 line-clamp-1 hover:text-primary-600 cursor-pointer">
                                {notice.title}
                            </p>
                            <span className="text-xs text-slate-400">{notice.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
