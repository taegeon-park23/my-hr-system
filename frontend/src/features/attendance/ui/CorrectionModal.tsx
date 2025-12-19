'use client';

import React from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';

interface CorrectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        date: string;
        checkIn: string;
        checkOut: string;
    };
}

export const CorrectionModal = ({ isOpen, onClose, initialData }: CorrectionModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="근태 수정 요청">
            <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="대상 일자"
                        type="date"
                        defaultValue={initialData?.date || ''}
                        disabled
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="수정 출근 시간"
                            type="time"
                            defaultValue={initialData?.checkIn || ''}
                        />
                        <Input
                            label="수정 퇴근 시간"
                            type="time"
                            defaultValue={initialData?.checkOut || ''}
                        />
                    </div>
                    <Select
                        label="수정 사유"
                        options={[
                            { value: 'FORGOT', label: '기입 누락' },
                            { value: 'ERROR', label: '단말기 오류' },
                            { value: 'OUTSIDE', label: '외근/출장' },
                            { value: 'OTHER', label: '기타' },
                        ]}
                    />
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-slate-700">상세 사유</label>
                        <textarea
                            className="w-full border-slate-200 rounded-lg focus:ring-primary-500 min-h-[100px] p-3 text-sm"
                            placeholder="구체적인 사유를 입력해주세요."
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="secondary" onClick={onClose}>취소</Button>
                    <Button onClick={() => {
                        alert('수정 요청이 제출되었습니다.');
                        onClose();
                    }}>요청 제출</Button>
                </div>
            </div>
        </Modal>
    );
};
