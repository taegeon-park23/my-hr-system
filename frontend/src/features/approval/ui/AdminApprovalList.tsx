'use client';

import React from 'react';
import Link from 'next/link';
import { ApprovalRequest } from '../model/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

interface AdminApprovalListProps {
    requests: ApprovalRequest[];
    isLoading?: boolean;
    onForceDecision: (id: number, status: 'APPROVED' | 'REJECTED') => void;
}

export const AdminApprovalList = ({
    requests,
    isLoading,
    onForceDecision
}: AdminApprovalListProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">문서 정보</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">기안자</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">유형</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">강제 처리 (Admin)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    문서가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            requests.map((request) => (
                                <tr key={request.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800">{request.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{new Date(request.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        UID: {request.requesterUserId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary">{request.resourceType}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={(
                                                request.status === 'APPROVED' ? 'primary' :
                                                    request.status === 'REJECTED' ? 'danger' : 'warning'
                                            ) as any}
                                        >
                                            {request.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {request.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => onForceDecision(request.id, 'APPROVED')}
                                                    className="px-3 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                                                >
                                                    강제 승인
                                                </button>
                                                <button
                                                    onClick={() => onForceDecision(request.id, 'REJECTED')}
                                                    className="px-3 py-1 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition"
                                                >
                                                    강제 반려
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
