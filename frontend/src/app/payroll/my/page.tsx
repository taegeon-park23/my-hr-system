'use client';

import { useMyPayslips } from '@/features/payroll/api';
import { PayslipDetailView } from '@/features/payroll/ui/PayslipDetailView';
import { useState } from 'react';

export default function MyPayslipPage() {
    const { payslips, isLoading } = useMyPayslips();
    const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null);

    if (isLoading) return <div>Loading...</div>;

    const selectedPayslip = payslips?.find(p => p.id === selectedPayslipId);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">내 급여 명세서</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* List (Desktop: Left, Mobile: Top) */}
                <div className="md:col-span-4 space-y-4">
                    {payslips?.length === 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                            조회된 급여 명세서가 없습니다.
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
                                <span className="font-bold text-lg">{payslip.targetMonth} 정기급여</span>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">지급완료</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>실수령액</span>
                                <span className="font-bold text-gray-900">{payslip.netAmount.toLocaleString()}원</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                <div className="md:col-span-8">
                    {selectedPayslip ? (
                        <PayslipDetailView payslip={selectedPayslip} />
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed text-gray-400">
                            목록에서 명세서를 선택하세요.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
