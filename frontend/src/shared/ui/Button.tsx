import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { Spinner } from './Spinner';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
                secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500',
                danger: 'bg-danger text-white hover:bg-rose-700 focus:ring-danger',
                ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 focus:ring-slate-500',
            },
            size: {
                sm: 'h-8 px-3 text-sm',
                md: 'h-10 px-4 text-sm',
                lg: 'h-12 px-6 text-base',
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
    children?: React.ReactNode;
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
