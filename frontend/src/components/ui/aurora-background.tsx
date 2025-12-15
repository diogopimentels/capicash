import { cn } from "@/lib/utils"
import React from "react"

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> { }

function AuroraBackgroundComponent({ className, ...props }: AuroraBackgroundProps) {
    return (
        <div
            className={cn(
                "pointer-events-none fixed inset-0 -z-[9999] overflow-hidden",
                "bg-zinc-50 dark:bg-black transition-colors duration-500",
                "will-change-transform",
                className
            )}
            {...props}
        >
            {/* Optimization: Removed mix-blend-mode and reduced blur radius */}

            {/* Orb 1 */}
            <div className={cn(
                "absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full filter blur-[80px] animate-blob opacity-40 dark:opacity-20",
                "bg-emerald-200 dark:bg-emerald-900",
                "backface-hidden transform-gpu translate-z-0"
            )} />

            {/* Orb 2 */}
            <div className={cn(
                "absolute top-[10%] right-[0%] w-[60vw] h-[60vw] rounded-full filter blur-[80px] animate-blob animation-delay-4000 opacity-40 dark:opacity-20",
                "bg-blue-200 dark:bg-blue-900",
                "backface-hidden transform-gpu translate-z-0"
            )} />

            {/* Orb 3 - Reduced size */}
            <div className={cn(
                "absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] rounded-full filter blur-[80px] animate-blob animation-delay-2000 opacity-40 dark:opacity-15",
                "bg-teal-200 dark:bg-teal-900",
                "backface-hidden transform-gpu translate-z-0"
            )} />
        </div>
    )
}

export const AuroraBackground = React.memo(AuroraBackgroundComponent)
