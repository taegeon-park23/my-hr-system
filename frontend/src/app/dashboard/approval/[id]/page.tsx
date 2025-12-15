'use client';

import React from 'react';

import { useApprovalDetail } from '@/features/approval/api/approvalApi';
import { Button } from '@/shared/ui/Button';
import { useRouter, useParams } from 'next/navigation';
import { ApiErrorFallback } from '@/shared/ui/ApiErrorFallback';

export default function ApprovalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);

    const { data: request, isLoading, isError } = useApprovalDetail(id);

    if (isLoading) {
        return <div className="p-8">Loading approval details...</div>;
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
        return <div className="p-8">Request not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        {request.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Requested by {request.requesterName} on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
                    <Button variant="secondary" onClick={() => router.back()}>
                        Back
                    </Button>
                    {/* Approve/Reject buttons would go here */}
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
        </div>
    );
}
