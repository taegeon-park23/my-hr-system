'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong!
            </h2>
            <p className="text-gray-500 mb-6">
                {error.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="secondary">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'}>
                    Go Home
                </Button>
            </div>
        </div>
    );
}
