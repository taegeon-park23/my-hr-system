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
    const { isAuthenticated, _hasHydrated } = useAuthStore();
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;

        const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const token = typeof window !== 'undefined' ? Cookies.get(STORAGE_KEYS.ACCESS_TOKEN) : null;

    // Show loading if:
    // 1. We have a token but store hasn't hydrated yet (prevent Guest view flash)
    // 2. We are not authenticated and checking (legacy check)
    if ((token && !_hasHydrated) || (!isAuthenticated && token && !_hasHydrated)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If no token and not authenticated, we rely on the useEffect to redirect, 
    // but we can render children or null. Usually null or loader until redirect happens.
    if (!isAuthenticated && !token) {
        return null;
    }

    return <>{children}</>;
};


