'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { STORAGE_KEYS } from '@/shared/config/constants';
import Cookies from 'js-cookie';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: string; // Future expansion
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;

        const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // If not authenticated and no token in cookies
    if (!isAuthenticated && typeof window !== 'undefined' && !Cookies.get(STORAGE_KEYS.ACCESS_TOKEN)) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return <>{children}</>;
};


