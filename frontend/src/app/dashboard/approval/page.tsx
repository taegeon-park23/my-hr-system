'use client';

import { useState } from 'react';
import { useApprovalInbox } from '@/features/approval/api/approvalApi';
import { ApprovalList } from '@/features/approval/ui/ApprovalList';
import { RequestForm } from '@/features/approval/ui/RequestForm';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export default function ApprovalPage() {
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuthStore();
    const { data: requests, isLoading, mutate } = useApprovalInbox(user?.id);

    return (
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

            {showForm && (
                <RequestForm onSuccess={() => {
                    setShowForm(false);
                    mutate();
                }} />
            )}

            <ApprovalList requests={requests} isLoading={isLoading} />
        </div>
    );
}

