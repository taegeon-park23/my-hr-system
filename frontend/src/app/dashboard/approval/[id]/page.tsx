'use client';

import React from 'react';

import { useApprovalDetail, approveStep, rejectStep } from '@/features/approval/api/approvalApi';
import { Button } from '@/shared/ui/Button';
import { useRouter, useParams } from 'next/navigation';
import { ApiErrorFallback } from '@/shared/ui/ApiErrorFallback';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { ApprovalTimeline } from '@/features/approval/ui/ApprovalTimeline';

export default function ApprovalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);
    const { user } = useAuthStore();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [comment, setComment] = React.useState('');

    const { data: request, isLoading, isError, mutate } = useApprovalDetail(id);

    // Find the current active step that the current user can approve
    const currentStep = request?.steps?.find(step =>
        step.status === 'PENDING' && step.approverId === user?.id
    );

    const handleApprove = async () => {
        if (!currentStep) return;
        setIsProcessing(true);
        try {
            await approveStep(currentStep.id, comment);
            setComment('');
            await mutate();
        } catch (error) {
            console.error('Failed to approve:', error);
            alert('Failed to approve request');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!currentStep) return;
        setIsProcessing(true);
        try {
            await rejectStep(currentStep.id, comment);
            setComment('');
            await mutate();
        } catch (error) {
            console.error('Failed to reject:', error);
            alert('Failed to reject request');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading approval details...</div>;
    }

    if (isError) {
        return (
            <div className="p-8">
                <ApiErrorFallback
                    error={isError}
                    title="Failed to load approval request"
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    if (!request) {
        return <div className="p-8 text-center text-gray-500">Request not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <div className="md:flex md:items-center md:justify-between border-b border-gray-200 pb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        {request.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Requested by <span className="font-semibold text-gray-700">{request.requesterName}</span> on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
                    {currentStep && (
                        <div className="flex-1 min-w-0 md:mr-4">
                            <textarea
                                rows={2}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 bg-gray-50 text-gray-900 border"
                                placeholder="Add a comment (optional)..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex flex-shrink-0 space-x-3">
                        <Button variant="secondary" onClick={() => router.back()}>
                            Back
                        </Button>
                        {currentStep && (
                            <>
                                <Button
                                    variant="danger"
                                    onClick={handleReject}
                                    isLoading={isProcessing}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleApprove}
                                    isLoading={isProcessing}
                                >
                                    Approve
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Request Information</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Resource Type</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.type}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {request.status}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {request.steps && request.steps.length > 0 && (
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <ApprovalTimeline steps={request.steps} />
                </div>
            )}
        </div>
    );
}
