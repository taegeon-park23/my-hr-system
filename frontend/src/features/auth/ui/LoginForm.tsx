'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { login } from '../api/authApi';
import { useAuthStore } from '@/shared/stores/useAuthStore';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const loginUser = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Basic validation
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            const response = await login({ email, password: password });
            loginUser(response.user, response.accessToken);

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@samsung.com"
                error={error ? ' ' : undefined} // Logic to show generic error if needed, but handled by alert below usually
            />

            <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
                <div className="text-sm text-danger bg-danger-bg p-3 rounded-md" role="alert">
                    {error}
                </div>
            )}

            <div>
                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                >
                    Sign in
                </Button>
            </div>

            <div className="text-center text-sm">
                <span className="text-text-sub">Don&apos;t have an account? </span>
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                    Contact your administrator
                </a>
            </div>
        </form>
    );
};
