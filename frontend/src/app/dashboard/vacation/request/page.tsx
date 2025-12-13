"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { VacationRequestForm } from '@/features/vacation/ui/VacationRequestForm';

export default function VacationRequestPage() {
    const router = useRouter();

    return (
        <div className="p-8">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-700 mb-2"
                >
                    &larr; 돌아가기
                </button>
                <h1 className="text-2xl font-bold text-gray-900">휴가 신청</h1>
            </div>

            <VacationRequestForm />
        </div>
    );
}
