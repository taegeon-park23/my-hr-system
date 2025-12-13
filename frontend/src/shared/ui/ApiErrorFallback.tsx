import React from 'react';
import { Button } from './Button';

interface ApiErrorFallbackProps {
    error?: Error | unknown;
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export const ApiErrorFallback = ({
    error,
    title = 'API 요청 실패',
    message,
    onRetry
}: ApiErrorFallbackProps) => {
    const errorMessage = message || (error instanceof Error ? error.message : '데이터를 불러오는 중 오류가 발생했습니다.');

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[200px]">
            <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 text-center mb-4 max-w-md">
                {errorMessage}
            </p>
            {onRetry && (
                <Button onClick={onRetry} variant="secondary">
                    다시 시도
                </Button>
            )}
        </div>
    );
};

// Helper component for SWR error states
interface SWRErrorProps {
    isError: unknown;
    onRetry?: () => void;
    children: React.ReactNode;
}

export const WithSWRError = ({ isError, onRetry, children }: SWRErrorProps) => {
    if (isError) {
        return <ApiErrorFallback error={isError} onRetry={onRetry} />;
    }
    return <>{children}</>;
};
