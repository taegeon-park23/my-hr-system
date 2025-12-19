'use client';

import React from 'react';
import { Department } from '../model/types';
import { useUsers } from '@/features/user/api/userApi';
import { Icon } from '@/shared/ui/Icon';
import { Badge } from '@/shared/ui/Badge';

interface OrgDetailPanelProps {
    department: Department | null;
}

export const OrgDetailPanel = ({ department }: OrgDetailPanelProps) => {
    const { data: members, isLoading } = useUsers({ deptId: department?.id });

    if (!department) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <Icon name="InformationCircleIcon" className="w-12 h-12 mb-4 opacity-20" />
                <p>부서를 선택하면 상세 정보와 소속원을 확인할 수 있습니다.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">부서 상세 정보</span>
                    <Badge variant={"outline" as any}>ID: {department.id}</Badge>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{department.name}</h2>
                <p className="text-sm text-slate-500 mt-1">상위 조직: {department.parentId || '최상위'}</p>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                        <Icon name="UsersIcon" className="w-4 h-4 mr-2 text-slate-400" />
                        소속 구성원 ({members?.length || 0})
                    </h3>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : members && members.length > 0 ? (
                        <div className="grid gap-3">
                            {members.map((member: any) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-primary-100 hover:shadow-sm transition group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={(member.role === 'MANAGER' ? 'primary' : 'secondary') as any}>
                                            {member.role === 'MANAGER' ? '부서장' : '팀원'}
                                        </Badge>
                                        <button className="p-2 text-slate-300 hover:text-primary-600 transition opacity-0 group-hover:opacity-100">
                                            <Icon name="EllipsisVerticalIcon" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            소속된 구성원이 없습니다.
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                    조직 정보 수정
                </button>
                <button className="px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition shadow-sm shadow-primary-100">
                    부서원 추가
                </button>
            </div>
        </div>
    );
};
