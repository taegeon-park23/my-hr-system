import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const inputVariants = cva(
    'block w-full rounded-md border border-slate-300 bg-white h-10 px-3 py-2 text-sm placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:border-primary disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed',
    {
        variants: {
            hasError: {
                true: 'border-rose-500 focus:ring-rose-200 focus:border-rose-500 text-rose-900 placeholder:text-rose-300',
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
