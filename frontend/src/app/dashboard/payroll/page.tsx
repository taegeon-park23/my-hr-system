'use client';

import { useMyPayslips } from '@/features/payroll/api';
import { PayslipDetailView } from '@/features/payroll/ui/PayslipDetailView';
import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export default function PayrollPage() {
    const { user } = useAuthStore();
    const { payslips, isLoading } = useMyPayslips(user?.id ?? 0);
    const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null);

    if (isLoading) return <div className="text-center py-10">Loading payroll data...</div>;

    const selectedPayslip = payslips?.find(p => p.id === selectedPayslipId);

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        My Payrolls
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Button variant="secondary">Download Year Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* List */}
                <div className="md:col-span-4 space-y-4">
                    {payslips?.length === 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                            No payslips found.
                        </div>
                    )}
                    {payslips?.map(payslip => (
                        <div
                            key={payslip.id}
                            onClick={() => setSelectedPayslipId(payslip.id)}
                            className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition
                                ${selectedPayslipId === payslip.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}
                            `}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">{payslip.targetMonth}</span>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">Paid</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Net Amount</span>
                                <span className="font-bold text-gray-900">{payslip.netAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail */}
                <div className="md:col-span-8">
                    {selectedPayslip ? (
                        <PayslipDetailView payslip={selectedPayslip} />
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                            Select a payslip to view details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
