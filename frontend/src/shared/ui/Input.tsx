import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const inputVariants = cva(
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500',
    {
        variants: {
            hasError: {
                true: 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
                false: '',
            },
        },
        defaultVariants: {
            hasError: false,
        },
    }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={cn(inputVariants({ hasError: !!error }), className)}
                        {...props}
                    />
                </div>
                {(error || helperText) && (
                    <p className={cn("mt-1 text-sm", error ? 'text-red-600' : 'text-gray-500')}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
