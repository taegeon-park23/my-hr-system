'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { User, UserSaveRequest } from '../api/userApi';

interface UserUpsertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserSaveRequest) => void;
    initialData?: User | null;
    isSubmitting?: boolean;
}

export const UserUpsertModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting,
}: UserUpsertModalProps) => {
    const [activeTab, setActiveTab] = useState<'basic' | 'org' | 'account'>('basic');
    const { register, handleSubmit, reset, setValue } = useForm<UserSaveRequest>();

    useEffect(() => {
        if (initialData) {
            reset({
                email: initialData.email,
                name: initialData.name,
                deptId: initialData.deptId,
                role: initialData.role,
            });
        } else {
            reset({
                email: '',
                name: '',
                password: '',
                deptId: null,
                role: 'USER',
            });
        }
        setActiveTab('basic');
    }, [initialData, reset, isOpen]);

    const onFormSubmit = (data: UserSaveRequest) => {
        onSubmit(data);
    };

    const tabs = [
        { id: 'basic', label: '기본 정보' },
        { id: 'org', label: '조직 정보' },
        { id: 'account', label: '계정 정보' },
    ] as const;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? '구성원 정보 수정' : '신규 구성원 등록'}
            size="lg"
        >
            <div className="mb-6 border-b border-slate-100">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 text-sm font-medium transition ${activeTab === tab.id
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {activeTab === 'basic' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        <Input
                            label="이름"
                            {...register('name', { required: '이름은 필수입니다.' })}
                            placeholder="홍길동"
                        />
                        <Input
                            label="이메일"
                            type="email"
                            {...register('email', { required: '이메일은 필수입니다.' })}
                            placeholder="user@example.com"
                            disabled={!!initialData}
                        />
                    </div>
                )}

                {activeTab === 'org' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">부서</label>
                            <div className="text-sm text-slate-400 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                부서 선택 (Tree Selector 구현 예정)
                                {/* 임시로 숫자 입력 */}
                                <input
                                    type="number"
                                    {...register('deptId')}
                                    className="mt-2 block w-full border-slate-200 rounded-lg"
                                    placeholder="부서 ID"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'account' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        <Select
                            label="권한"
                            {...register('role')}
                            options={[
                                { value: 'USER', label: '일반 사용자' },
                                { value: 'MANAGER', label: '매니저' },
                                { value: 'TENANT_ADMIN', label: '기업 관리자' },
                            ]}
                        />
                        {!initialData && (
                            <Input
                                label="초기 비밀번호"
                                type="password"
                                {...register('password')}
                                placeholder="미입력 시 1234로 설정"
                            />
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button variant="secondary" onClick={onClose} type="button">
                        취소
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {initialData ? '저장' : '등록'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
