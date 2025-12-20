'use client';

import { useState } from 'react';
import { useApprovalInbox, usePendingApprovals, useApprovalArchive } from '@/features/approval/api/approvalApi';
import { ApprovalList } from '@/features/approval/ui/ApprovalList';
import { ApprovalActionToolbar } from '@/features/approval/ui/ApprovalActionToolbar';
import { RequestForm } from '@/features/approval/ui/RequestForm';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { ApiErrorFallback } from '@/shared/ui/ApiErrorFallback';

type TabType = 'to-approve' | 'initiated' | 'archive';


import { useApprovalInbox, useApprovalOutbox, useApprovalArchive, bulkApprove, forceApprovalDecision, approveStep } from '@/features/approval/api/approvalApi';
import { useSWRConfig } from 'swr';
import { useToast } from '@/shared/ui/Toast';

export default function ApprovalPage() {
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('to-approve');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuthStore();
    const { mutate: globalMutate } = useSWRConfig();
    const { showToast } = useToast();

    // inbox: "To Approve" (Waiting for me)
    const inbox = useApprovalInbox();
    // outbox: "Initiated" (My requests)
    const outbox = useApprovalOutbox(user?.id);
    const archive = useApprovalArchive();


    const getActiveData = () => {
        switch (activeTab) {
            case 'to-approve': return inbox;
            case 'initiated': return outbox;
            case 'archive': return archive;
            default: return inbox;
        }
    };

    const { data, isLoading, isError, mutate } = getActiveData();

    const handleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;
        try {
            await bulkApprove(selectedIds);
            showToast(`${selectedIds.length}건이 일괄 승인되었습니다.`, 'success');
            setSelectedIds([]);
            mutate();
            globalMutate((key) => Array.isArray(key) && key[0] === 'dashboard'); // Update dashboard stats
        } catch (error) {
            showToast('일괄 승인에 실패했습니다.', 'error');
        }
    };

    const handleQuickApprove = async (id: number) => {
        try {
            // Find request to get stepId? 
            // The ApprovalList calls this with docId. We need stepId to approve.
            // Simplified assumption: The backend 'bulk-approve' or a new 'quick-approve' endpoint handles it by docId.
            // OR we iterate over data to find the current stepId for the user.
            // Since we implemented `bulkApprove` taking IDs, let's use that for single item too or proper API.
            // Let's use bulkApprove([id]) for consistent generic approval of "my pending step".
            await bulkApprove([id]);
            showToast(`문서 #${id}가 승인되었습니다.`, 'success');
            mutate();
            globalMutate((key) => Array.isArray(key) && key[0] === 'dashboard');
        } catch (error) {
            showToast('승인 처리에 실패했습니다.', 'error');
        }
    };

    const filteredData = (data || []).filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ErrorBoundary>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 font-display">전자 결재</h1>
                        <p className="text-sm text-slate-500 mt-1">결재 대기 문서 및 기안 내역을 통합 관리합니다.</p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)}>
                        <Icon name={showForm ? 'XMarkIcon' : 'PlusIcon'} className="w-5 h-5 mr-1" />
                        {showForm ? '신청 취소' : '신규 결재 기안'}
                    </Button>
                </div>

                {showForm && (
                    <div className="animate-in zoom-in-95 duration-300">
                        <RequestForm onSuccess={() => {
                            setShowForm(false);
                            mutate();
                        }} />
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-200">
                        {[
                            { id: 'to-approve', label: '결재할 문서', icon: 'ClipboardDocumentCheckIcon' },
                            { id: 'initiated', label: '기안한 문서', icon: 'DocumentTextIcon' },
                            { id: 'archive', label: '완료함', icon: 'ArchiveBoxIcon' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id as TabType);
                                    setSelectedIds([]);
                                }}
                                className={`flex items-center px-4 py-3 text-sm font-medium transition-all relative ${activeTab === tab.id
                                    ? 'text-primary-600'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Icon name={tab.icon as any} className="w-4 h-4 mr-2" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    <ApprovalActionToolbar
                        selectedCount={selectedIds.length}
                        onBulkApprove={handleBulkApprove}
                        onBulkReject={() => alert('일괄 반려 처리')}
                        onSearchChange={setSearchTerm}
                    />

                    {isError ? (
                        <ApiErrorFallback
                            error={isError}
                            title="데이터 로드 실패"
                            onRetry={() => mutate()}
                        />
                    ) : (
                        <ApprovalList
                            requests={filteredData}
                            isLoading={isLoading}
                            selectedIds={selectedIds}
                            onSelect={handleSelect}
                            onSelectAll={setSelectedIds}
                            onQuickApprove={handleQuickApprove}
                        />
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
}



