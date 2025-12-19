'use client';

import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Icon } from '@/shared/ui/Icon';

interface ApprovalActionToolbarProps {
    selectedCount: number;
    onBulkApprove: () => void;
    onBulkReject: () => void;
    onSearchChange: (value: string) => void;
}

export const ApprovalActionToolbar = ({
    selectedCount,
    onBulkApprove,
    onBulkReject,
    onSearchChange
}: ApprovalActionToolbarProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="MagnifyingGlassIcon" className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                    className="pl-10 h-10"
                    placeholder="문서 제목, 기안자 검색..."
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center space-x-3">
                {selectedCount > 0 && (
                    <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-2 duration-300">
                        <span className="text-sm font-medium text-slate-500 mr-2">
                            <span className="text-primary-600 font-bold">{selectedCount}</span>건 선택됨
                        </span>
                        <Button size="sm" onClick={onBulkApprove}>일괄 승인</Button>
                        <Button size="sm" variant="danger" onClick={onBulkReject}>일괄 반려</Button>
                        <div className="w-px h-4 bg-slate-300 mx-2" />
                    </div>
                )}
                <Button size="sm" variant="secondary">
                    <Icon name="FunnelIcon" className="w-4 h-4 mr-1" />
                    필터
                </Button>
            </div>
        </div>
    );
};
