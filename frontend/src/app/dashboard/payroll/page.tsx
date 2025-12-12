'use client';

import { useEffect, useState } from 'react';
import { getMyPayrolls } from '@/features/payroll/api/payrollApi';
import { PayrollList } from '@/features/payroll/ui/PayrollList';
import { PayrollStub } from '@/features/payroll/model/types';
import { Button } from '@/shared/ui/Button';

export default function PayrollPage() {
    const [stubs, setStubs] = useState<PayrollStub[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getMyPayrolls();
                setStubs(data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Payroll Information
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Button variant="secondary">Download Year Report</Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading payroll data...</div>
            ) : (
                <PayrollList stubs={stubs} />
            )}
        </div>
    );
}
