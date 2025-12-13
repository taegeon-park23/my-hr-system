import { useState } from 'react';
import { PayrollCreateRequest } from '../model/types';
import { createPayroll } from '../api';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function PayrollCreateModal({ isOpen, onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState<PayrollCreateRequest>({
        title: '',
        targetMonth: '',
        paymentDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createPayroll(formData);
            onSuccess();
            onClose();
        } catch (error) {
            alert('생성 실패: ' + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="급여 대장 생성">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">제목</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="예: 2024년 12월 정기 급여"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">귀속월</label>
                    <input
                        type="month"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.targetMonth}
                        onChange={e => setFormData({ ...formData, targetMonth: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">지급일</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.paymentDate}
                        onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
                        required
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        취소
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        생성
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

