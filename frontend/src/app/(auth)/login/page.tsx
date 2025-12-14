'use client';

import { LoginForm } from '@/features/auth/ui/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-title)]">
                    Sign in to HR System
                </h2>
                <p className="mt-2 text-center text-sm text-[var(--color-text-sub)]">
                    Or{' '}
                    <a href="#" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
                        contact support if you forgot password
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
