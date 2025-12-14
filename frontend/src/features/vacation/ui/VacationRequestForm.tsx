import React, { useState } from 'react';
import { vacationApi } from '../api/vacationApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

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

    const { register, handleSubmit, formState: { errors } } = useForm<VacationFormData>({
        resolver: zodResolver(vacationSchema),
        defaultValues: {
            type: 'ANNUAL',
            startDate: '',
            endDate: '',
            reason: ''
        }
    });

    const onSubmit = async (data: VacationFormData) => {
        if (!user) {
            if (!user) {
                alert('로그인이 필요합니다. 다시 로그인해주세요.');
                // router.push('/login'); // Middleware might redirect back if cookie exists, forcing manual re-login logic elsewhere
                return;
            }
        }

        setIsLoading(true);
        try {
            await vacationApi.requestVacation({ ...data, userId: user.id });
            alert('휴가가 신청되었습니다.');
            router.push('/dashboard/vacation');
        } catch (error) {
            console.error(error);
            alert('신청 실패');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">휴가 종류</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        {...register('type')}
                    >
                        <option value="ANNUAL">연차</option>
                        <option value="HALF_AM">오전반차</option>
                        <option value="HALF_PM">오후반차</option>
                        <option value="SICK">병가</option>
                        <option value="UNPAID">무급휴가</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">시작일</label>
                        <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            {...register('startDate')}
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">종료일</label>
                        <input
                            type="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            {...register('endDate')}
                        />
                        {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">사유</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        rows={3}
                        {...register('reason')}
                    />
                    {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
                </div>



                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full"
                >
                    휴가 신청하기
                </Button>
            </form>
        </Card>
    );
};
