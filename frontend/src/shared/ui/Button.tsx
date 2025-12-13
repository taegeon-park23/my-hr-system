import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
                secondary: 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50 focus:ring-secondary-500',
                danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
            },
            size: {
                sm: 'px-3 py-1.5 text-sm',
                md: 'px-4 py-2 text-sm',
                lg: 'px-6 py-3 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant,
    size,
    isLoading,
    className,
    disabled,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Spinner className="-ml-1 mr-2 h-4 w-4" />
            ) : null}
            {children}
        </button>
    );
};
