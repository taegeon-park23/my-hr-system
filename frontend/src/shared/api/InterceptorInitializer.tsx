"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/ui/Toast';
import { setupInterceptors } from '@/shared/api/client';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export function InterceptorInitializer() {
    const router = useRouter();
    const { showToast } = useToast();
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        setupInterceptors(
            // onUnauthorized
            () => {
                logout(); // Clear store state
                showToast("Session expired. Please login again.", 'error');
                router.replace('/login');
            },
            // onError
            (message) => {
                showToast(message, 'error');
            }
        );
    }, [router, showToast, logout]);

    return null;
}
