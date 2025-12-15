'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { STORAGE_KEYS } from '@/shared/config/constants';
import Cookies from 'js-cookie';

import { Spinner } from '@/shared/ui/Spinner';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: string; // Future expansion
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const router = useRouter();
    const { isAuthenticated, _hasHydrated } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !_hasHydrated) return;

        const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
        if (!token && !isAuthenticated) {
            router.push('/login');
        }
    }, [isMounted, _hasHydrated, isAuthenticated, router]);

    // Prevent hydration mismatch by withholding non-pristine content until client mount
    if (!isMounted || !_hasHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="h-8 w-8 text-indigo-600" />
            </div>
        );
    }

    // Check token again for render logic
    const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);

    // If no token and not authenticated, we rely on the useEffect to redirect, 
    // but we can render children or null. Usually null or loader until redirect happens.
    if (!isAuthenticated && !token) {
        return null;
    }

    return <>{children}</>;
};


