'use client';

import React from 'react';
import Link from 'next/link';
import { ApprovalRequest } from '../model/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

interface ApprovalListProps {
    requests: ApprovalRequest[];
    isLoading?: boolean;
    selectedIds: number[];
    onSelect: (id: number) => void;
    onSelectAll: (ids: number[]) => void;
    onQuickApprove: (id: number) => void;
}

export const ApprovalList = ({
    requests,
    isLoading,
    selectedIds,
    onSelect,
    onSelectAll,
    onQuickApprove
}: ApprovalListProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    const isAllSelected = requests.length > 0 && selectedIds.length === requests.length;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    checked={isAllSelected}
                                    onChange={() => onSelectAll(isAllSelected ? [] : requests.map(r => r.id))}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">문서 정보</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">유형</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">기안일</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">작업</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    <Icon name="InboxIcon" className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    문서가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            checked={selectedIds.includes(request.id)}
                                            onChange={() => onSelect(request.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/approval/${request.id}`} className="group">
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition">
                                                {request.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">기안자: 홍길동</p>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary">{request.type}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={
                                                request.status === 'APPROVED' ? 'primary' :
                                                    request.status === 'REJECTED' ? 'danger' : 'warning'
                                            }
                                        >
                                            {request.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {request.status === 'PENDING' && (
                                            <div className="flex justify-end space-x-1">
                                                <button
                                                    onClick={() => onQuickApprove(request.id)}
                                                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                                                    title="Quick Approve"
                                                >
                                                    <Icon name="CheckCircleIcon" className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                                                    title="Quick Reject"
                                                >
                                                    <Icon name="XCircleIcon" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

