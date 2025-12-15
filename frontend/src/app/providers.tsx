"use client";

import { SWRConfig } from 'swr';
import { fetcher } from '@/shared/api/fetcher';
import { ToastProvider, useToast } from '@/shared/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <SWRConfigProvider>{children}</SWRConfigProvider>
        </ToastProvider>
    );
}

function SWRConfigProvider({ children }: { children: React.ReactNode }) {
    const { showToast } = useToast();

    return (
        <SWRConfig
            value={{
                fetcher: fetcher,
                onError: (error, key) => {
                    if (error.status !== 403 && error.status !== 404) {
                        // We can show a toast here
                        showToast(error.message || 'An error occurred while fetching data.', 'error');
                    }
                },
                shouldRetryOnError: false,
                revalidateOnFocus: false,
                dedupingInterval: 5000,
                focusThrottleInterval: 30000,
            }}
        >
            {children}
        </SWRConfig>
    );
}
