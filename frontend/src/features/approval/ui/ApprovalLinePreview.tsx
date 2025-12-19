'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';

interface ApprovalStep {
    role: string;
    name: string;
    status: 'PENDING' | 'WAITING' | 'APPROVED';
}

interface ApprovalLinePreviewProps {
    steps: ApprovalStep[];
}

export const ApprovalLinePreview = ({ steps }: ApprovalLinePreviewProps) => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <Icon name="UsersIcon" className="w-5 h-5 mr-2 text-primary-500" />
                결재 경로
            </h3>

            <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                <div className="space-y-8 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${step.status === 'APPROVED' ? 'bg-primary-500' :
                                    step.status === 'PENDING' ? 'bg-amber-400' : 'bg-slate-200'
                                }`}>
                                {step.status === 'APPROVED' ? (
                                    <Icon name="CheckIcon" className="w-4 h-4 text-white" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-white opacity-50" />
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{step.role}</p>
                                <p className="text-sm font-bold text-slate-700">{step.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
