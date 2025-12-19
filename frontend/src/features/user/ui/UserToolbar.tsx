'use client';

import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

interface UserToolbarProps {
    onSearch: (query: string) => void;
    onAddUser: () => void;
}

export const UserToolbar = ({ onSearch, onAddUser }: UserToolbarProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
            <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="MagnifyingGlassIcon" className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition shadow-sm"
                    placeholder="이름, 이메일로 검색"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="secondary">
                    <Icon name="ArrowDownTrayIcon" className="w-4 h-4 mr-2" />
                    내보내기
                </Button>
                <Button onClick={onAddUser}>
                    <Icon name="PlusIcon" className="w-4 h-4 mr-2" />
                    직원 등록
                </Button>
            </div>
        </div>
    );
};
