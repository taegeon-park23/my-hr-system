import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-slate-100 text-slate-800",
                secondary:
                    "border-transparent bg-[var(--color-neutral-bg)] text-[var(--color-neutral)]",
                destructive:
                    "border-transparent bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
                danger:
                    "border-transparent bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
                success:
                    "border-transparent bg-[var(--color-success-bg)] text-[var(--color-success)]",
                warning:
                    "border-transparent bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
                info:
                    "border-transparent bg-[var(--color-info-bg)] text-[var(--color-info)]",
                neutral:
                    "border-transparent bg-[var(--color-neutral-bg)] text-[var(--color-neutral)]",
                outline: "text-slate-700 border-slate-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
