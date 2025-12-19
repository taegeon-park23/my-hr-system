'use client';

import React from 'react';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { QuickStats } from '@/widgets/Dashboard/QuickStats';
import { HiringAttritionChart } from '@/widgets/Dashboard/HiringAttritionChart';
import { TeamVacationWidget } from '@/widgets/Dashboard/TeamVacationWidget';
import { QuickActionWidget } from '@/widgets/Dashboard/QuickActionWidget';
import { Icon } from '@/shared/ui/Icon';

export default function AdminDashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-1.5 bg-primary-100 rounded-lg">
                        <Icon name="ShieldCheckIcon" className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Admin Console</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 font-display">
                    시스템 종합 현황
                </h1>
                <p className="text-slate-500 mt-1">관리자 권한으로 시스템의 주요 지표와 구성원을 관리합니다.</p>
            </header>

            <section>
                <QuickStats />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="h-[400px]">
                        <HiringAttritionChart />
                    </section>
                    <section>
                        <TeamVacationWidget />
                    </section>
                </div>

                <div className="space-y-8">
                    <section>
                        <QuickActionWidget />
                    </section>
                    <div className="p-6 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl text-white shadow-lg shadow-primary-100">
                        <h3 className="font-bold text-lg mb-2">관리자 가이드</h3>
                        <p className="text-primary-100 text-sm leading-relaxed mb-6">
                            신규 입사자 등록 및 결재 라인 설정은 구성원 관리 메뉴를 이용해 주세요.
                        </p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition rounded-xl text-sm font-bold backdrop-blur-md">
                            매뉴얼 확인하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
