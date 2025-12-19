'use client';

import React, { useState } from 'react';
import { UserToolbar } from '@/features/user/ui/UserToolbar';
import { UserList } from '@/features/user/ui/UserList';
import { UserUpsertModal } from '@/features/user/ui/UserUpsertModal';
import { useUsers, createUser, updateUser, User, UserSaveRequest } from '@/features/user/api/userApi';
import { useToast } from '@/shared/ui/Toast';

export default function AdminUserPage() {
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: users = [], isLoading, mutate } = useUsers({ query });
    const { showToast } = useToast();

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: UserSaveRequest) => {
        setIsSubmitting(true);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, data);
                showToast('구성원 정보가 수정되었습니다.', 'success');
            } else {
                await createUser(data);
                showToast('신규 구성원이 등록되었습니다.', 'success');
            }
            mutate();
            setIsModalOpen(false);
        } catch (error) {
            showToast('오류가 발생했습니다. 다시 시도해 주세요.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-slate-900 font-display">구성원 관리</h1>
                <p className="text-slate-500 mt-1">조직의 구성원을 등록하고 정보를 관리합니다.</p>
            </div>

            <UserToolbar
                onSearch={setQuery}
                onAddUser={handleAddUser}
            />

            <UserList
                users={users}
                isLoading={isLoading}
                onEdit={handleEditUser}
            />

            <UserUpsertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingUser}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
