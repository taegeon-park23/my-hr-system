'use client';

import { useState } from 'react';
import { useApprovalInbox, usePendingApprovals } from '@/features/approval/api/approvalApi';
import { ApprovalList } from '@/features/approval/ui/ApprovalList';
import { RequestForm } from '@/features/approval/ui/RequestForm';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { ApiErrorFallback } from '@/shared/ui/ApiErrorFallback';

export default function ApprovalPage() {
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'inbox' | 'pending'>('pending');
    const { user } = useAuthStore();

    // Hooks should be called unconditionally
    const inbox = useApprovalInbox(user?.id);
    const pending = usePendingApprovals(); // New hook call

    const currentData = activeTab === 'inbox' ? inbox.data : pending.data;
    const currentLoading = activeTab === 'inbox' ? inbox.isLoading : pending.isLoading;
    const currentError = activeTab === 'inbox' ? inbox.isError : pending.isError;
    const currentMutate = activeTab === 'inbox' ? inbox.mutate : pending.mutate;

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Approval Box
                        </h2>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Button onClick={() => setShowForm(!showForm)}>
                            {showForm ? 'Cancel Request' : 'New Request'}
                        </Button>
                    </div>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`${activeTab === 'pending'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Pending Approvals
                        </button>
                        <button
                            onClick={() => setActiveTab('inbox')}
                            className={`${activeTab === 'inbox'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            My Requests
                        </button>
                    </nav>
                </div>

                {showForm && (
                    <RequestForm onSuccess={() => {
                        setShowForm(false);
                        currentMutate();
                    }} />
                )}

                {currentError ? (
                    <ApiErrorFallback
                        error={currentError}
                        title="Failed to load approvals"
                        onRetry={() => currentMutate()}
                    />
                ) : (
                    <ApprovalList requests={currentData} isLoading={currentLoading} />
                )}
            </div>
        </ErrorBoundary>
    );
}


