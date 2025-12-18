import React from 'react';
import { ApprovalStep } from '../model/types';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ApprovalTimelineProps {
    steps: ApprovalStep[];
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ steps }) => {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="flow-root mt-10">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Approval Progress</h3>
            <ul role="list" className="-mb-8">
                {steps.map((step, stepIdx) => (
                    <li key={step.id}>
                        <div className="relative pb-8">
                            {stepIdx !== steps.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                                        ${step.status === 'APPROVED' ? 'bg-green-500' :
                                            step.status === 'REJECTED' ? 'bg-red-500' :
                                                step.status === 'PENDING' ? 'bg-blue-500' : 'bg-gray-400'}`}>
                                        {step.status === 'APPROVED' && <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />}
                                        {step.status === 'REJECTED' && <XCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />}
                                        {step.status === 'PENDING' && <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />}
                                        {step.status === 'WAITING' && <div className="h-2 w-2 rounded-full bg-white" />}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {step.status === 'APPROVED' ? 'Approved' :
                                                step.status === 'REJECTED' ? 'Rejected' :
                                                    step.status === 'PENDING' ? 'Pending approval' : 'Waiting'} by {' '}
                                            <span className="font-medium text-gray-900">{step.approverName}</span>
                                        </p>
                                        {step.comment && (
                                            <p className="mt-1 text-sm text-gray-600 italic">"{step.comment}"</p>
                                        )}
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                        {step.processedAt && (
                                            <time dateTime={step.processedAt}>
                                                {new Date(step.processedAt).toLocaleDateString()}
                                            </time>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
