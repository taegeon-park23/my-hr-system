'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayrollList } from '@/features/payroll/api';
import { PayrollListTable } from '@/features/payroll/ui/PayrollListTable';
import { PayrollCreateModal } from '@/features/payroll/ui/PayrollCreateModal';

export default function PayrollManagePage() {
    const router = useRouter();
    const { payrolls, isLoading, mutate } = usePayrollList();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">급여 대장 관리</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    + 대장 생성
                </button>
            </div>

            <PayrollListTable
                data={payrolls || []}
                onViewDetail={(id) => router.push(`/payroll/manage/${id}`)}
            />

            <PayrollCreateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => mutate()}
            />
        </div>
    );
}
