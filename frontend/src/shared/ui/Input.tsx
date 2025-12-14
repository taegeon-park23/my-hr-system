import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const inputVariants = cva(
    'block w-full rounded-md border border-slate-300 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:border-primary sm:text-sm disabled:bg-slate-100 disabled:text-slate-500 h-10 px-3',
    {
        variants: {
            hasError: {
                true: 'border-rose-500 focus:ring-rose-200 focus:border-rose-500 text-rose-900 placeholder-rose-300',
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
    ({ label, error, helperText, className, id, ...props }, ref) => {
        const uniqueId = React.useId();
        const inputId = id || uniqueId;
        const errorId = `${inputId}-error`;
        const helperTextId = `${inputId}-helper`;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={inputId}
                        ref={ref}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
                        className={cn(inputVariants({ hasError: !!error }), className)}
                        {...props}
                    />
                </div>
                {error && (
                    <p id={errorId} className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p id={helperTextId} className="mt-1 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
