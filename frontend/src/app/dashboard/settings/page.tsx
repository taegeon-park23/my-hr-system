'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Icon } from '@/shared/ui/Icon';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useMe, updateUser } from '@/features/user/api/userApi';
import { useToast } from '@/shared/ui/Toast';
import { Badge } from '@/shared/ui/Badge';

export default function SettingsPage() {
    const { user: authUser } = useAuthStore();
    const { data: profile, isLoading, mutate } = useMe();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'tenant'>('profile');

    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        try {
            await updateUser(profile.id, {
                name,
                email,
                deptId: profile.deptId,
                role: profile.role
            });
            showToast('프로필이 업데이트되었습니다.', 'success');
            mutate();
        } catch (error) {
            showToast('업데이트 중 오류가 발생했습니다.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', name: '프로필 설정', icon: 'UserIcon' },
        { id: 'security', name: '보안 및 비밀번호', icon: 'ShieldCheckIcon' },
    ];

    if (authUser?.role === 'TENANT_ADMIN') {
        tabs.push({ id: 'tenant', name: '회사 정보 관리', icon: 'BuildingOfficeIcon' });
    }

    if (isLoading) return <div className="p-8 animate-pulse bg-slate-50 h-screen rounded-3xl" />;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="설정"
                description="계정 정보 및 시스템 설정을 관리합니다."
            />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <Icon name={tab.icon as any} className="w-5 h-5" />
                            {tab.name}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <Card className="p-8 border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden glassmorphism relative">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">프로필 정보</h3>
                                    <p className="text-sm text-slate-500 mt-1">대시보드와 문서에 표시될 개인 정보를 수정합니다.</p>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">이메일 주소</label>
                                            <Input
                                                value={email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                placeholder="example@company.com"
                                                disabled // Email normally shouldn't be changed easily
                                                className="bg-slate-50 border-slate-200 rounded-xl"
                                            />
                                            <p className="text-[11px] text-slate-400 ml-1">이메일 변경은 관리자에게 문의하세요.</p>
                                        </div>

                                        <div className="grid gap-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">성명</label>
                                            <Input
                                                value={name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                                placeholder="이름을 입력하세요"
                                                className="border-slate-200 focus:border-primary-500 rounded-xl transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            isLoading={saving}
                                            className="w-full md:w-auto px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 font-bold shadow-lg shadow-primary-200 transition-all active:scale-95"
                                        >
                                            변경 사항 저장
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">보안 설정</h3>
                                    <p className="text-sm text-slate-500 mt-1">계정 보안을 위해 비밀번호를 주기적으로 변경하세요.</p>
                                </div>

                                <div className="space-y-4 py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                    <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-2">
                                        <Icon name="LockClosedIcon" className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm text-slate-500">비밀번호 변경 기능은 현재 준비 중입니다.</p>
                                    <Button variant="ghost" className="text-primary-600 font-bold">도움말 문의</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tenant' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">회사 정보</h3>
                                    <p className="text-sm text-slate-500 mt-1">조직 전체에 적용될 정보를 관리합니다.</p>
                                </div>

                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Icon name="InformationCircleIcon" className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div className="text-sm text-amber-800 leading-relaxed">
                                        <p className="font-bold mb-1">관리자 권한으로 접속 중입니다.</p>
                                        <p>회사명, 로고, 근무 규정 등 핵심 설정은 조직 관리 메뉴에서 더욱 상세하게 설정할 수 있습니다.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 mt-6">
                                    <div className="p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">소속 회사 ID</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{authUser?.companyId}</p>
                                        </div>
                                        <Badge variant="info">ACTIVE</Badge>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-rose-100/20 rounded-full blur-3xl -z-10" />
                    </Card>
                </main>
            </div>

            <style jsx>{`
                .glassmorphism {
                    background: rgba(255, 255, 255, 0.82);
                    backdrop-filter: blur(12px);
                }
            `}</style>
        </div>
    );
}
