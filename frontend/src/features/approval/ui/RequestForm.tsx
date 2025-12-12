import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { createApprovalRequest } from '../api/approvalApi';

export const RequestForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('VACATION');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createApprovalRequest({ title, type: type as any });
            alert('Request submitted successfully!');
            setTitle('');
            if (onSuccess) onSuccess();
        } catch (e) {
            alert('Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-medium">New Request</h3>
            <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Summer Vacation"
            />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="VACATION">Vacation</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="EQUIPMENT">Equipment</option>
                </select>
            </div>
            <div className="pt-2">
                <Button type="submit" isLoading={isSubmitting}>Submit Request</Button>
            </div>
        </form>
    );
};
