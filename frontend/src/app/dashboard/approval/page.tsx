'use client';

import { useEffect, useState } from 'react';
import { getApprovalList } from '@/features/approval/api/approvalApi';
import { ApprovalList } from '@/features/approval/ui/ApprovalList';
import { RequestForm } from '@/features/approval/ui/RequestForm';
import { ApprovalRequest } from '@/features/approval/model/types';
import { Button } from '@/shared/ui/Button';

export default function ApprovalPage() {
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getApprovalList();
            setRequests(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                    fetchData();
                }} />
            )}

            <ApprovalList requests={requests} isLoading={loading} />
        </div>
    );
}
