import React, { useState, useEffect } from 'react';
import { vacationApi } from '../api/vacationApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Badge } from '@/shared/ui/Badge';

const vacationSchema = z.object({
    type: z.enum(['ANNUAL', 'HALF_AM', 'HALF_PM', 'SICK', 'UNPAID']),
    startDate: z.string().min(1, '시작일을 선택하세요'),
    endDate: z.string().min(1, '종료일을 선택하세요'),
    reason: z.string().min(5, '사유를 5자 이상 입력하세요')
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: "종료일은 시작일보다 빠를 수 없습니다",
    path: ["endDate"]
});

type VacationFormData = z.infer<typeof vacationSchema>;

export const VacationRequestForm = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const currentYear = new Date().getFullYear();
    const { balance } = useMyVacationBalance(user?.id, currentYear);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<VacationFormData | null>(null);

    const { register, handleSubmit, control, formState: { errors } } = useForm<VacationFormData>({
        resolver: zodResolver(vacationSchema),
        defaultValues: {
            type: 'ANNUAL',
            startDate: '',
            endDate: '',
            reason: ''
        }
    });

    const watchedValues = useWatch({ control });
    const [deduction, setDeduction] = useState(0);

    useEffect(() => {
        const calculateDeduction = () => {
            const { type, startDate, endDate } = watchedValues;
            if (!startDate || !endDate) return 0;

            if (type === 'HALF_AM' || type === 'HALF_PM') return 0.5;
            if (type === 'SICK' || type === 'UNPAID') return 0;

            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Simple calculation (not accounting for weekends in this mock)
            return diffDays;
        };
        setDeduction(calculateDeduction());
    }, [watchedValues]);

    const handleFormSubmit = (data: VacationFormData) => {
        if (deduction > (balance?.remainingDays || 0) && (data.type === 'ANNUAL' || data.type === 'HALF_AM' || data.type === 'HALF_PM')) {
            showToast('잔여 연차가 부족합니다.', 'error');
            return;
        }
        setPendingData(data);
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        if (!pendingData || !user) return;

        setIsLoading(true);
        try {
            await vacationApi.requestVacation({ ...pendingData, userId: user.id });
            showToast('휴가가 신청되었습니다.', 'success');
            router.push('/dashboard/vacation');
        } catch (error) {
            console.error(error);
            showToast('휴가 신청에 실패했습니다.', 'error');
        } finally {
            setIsLoading(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <Card className="p-8">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">휴가 종류</label>
                    <Select
                        {...register('type')}
                        options={[
                            { value: 'ANNUAL', label: '연차' },
                            { value: 'HALF_AM', label: '오전반차 (0.5일)' },
                            { value: 'HALF_PM', label: '오후반차 (0.5일)' },
                            { value: 'SICK', label: '병가 (유급)' },
                            { value: 'UNPAID', label: '무급휴가' },
                        ]}
                    />
                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Input
                            label="시작일"
                            type="date"
                            error={errors.startDate?.message}
                            {...register('startDate')}
                        />
                    </div>
                    <div>
                        <Input
                            label="종료일"
                            type="date"
                            error={errors.endDate?.message}
                            {...register('endDate')}
                            disabled={watchedValues.type === 'HALF_AM' || watchedValues.type === 'HALF_PM'}
                        />
                    </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-xl flex items-center justify-between border border-primary-100">
                    <span className="text-sm font-medium text-primary-700">예상 차감 일수</span>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary-700">{deduction}</span>
                        <span className="text-sm font-medium text-primary-600">일</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">휴가 사유</label>
                    <textarea
                        className="w-full border-slate-200 rounded-lg focus:ring-primary-500 min-h-[120px] p-3 text-sm"
                        placeholder="사유를 입력해주세요 (5자 이상)"
                        {...register('reason')}
                    />
                    {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                </div>

                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full h-12 text-lg font-bold"
                    disabled={deduction > (balance?.remainingDays || 0) && ['ANNUAL', 'HALF_AM', 'HALF_PM'].includes(watchedValues.type)}
                >
                    휴가 신청
                </Button>
            </form>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirm}
                title="휴가 신청 확인"
                description={`총 ${deduction}일의 휴가를 신청하시겠습니까?`}
                confirmLabel="신청하기"
            />
        </Card>
    );
};

