import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'bg-primary/10 text-primary hover:bg-primary/20',
                secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
                primary: 'bg-primary text-white hover:bg-primary/80 border-transparent',
                success: 'bg-success-bg text-success hover:bg-success-bg/80',
                warning: 'bg-warning-bg text-warning-800 hover:bg-warning-bg/80', // Text color optimized for contrast
                danger: 'bg-danger-bg text-danger hover:bg-danger-bg/80',
                info: 'bg-info-bg text-info hover:bg-info-bg/80',
                neutral: 'bg-neutral-bg text-neutral hover:bg-neutral-bg/80',
                outline: 'text-slate-950 border border-slate-200',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    children?: React.ReactNode;
}


function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
