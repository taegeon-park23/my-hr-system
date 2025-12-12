import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { login, LoginRequest } from '../api/authApi';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Basic validation
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            await login({ email, passwordHash: password }); // In real app, hash on client or send raw HTTPS
            alert('Login Successful! Redirecting...');
            // Navigation would happen here
        } catch (err: any) {
            setError(err.message || 'Login failed');
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
            />

            <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
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
                <span className="text-gray-500">Don't have an account? </span>
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Contact your administrator
                </a>
            </div>
        </form>
    );
};
