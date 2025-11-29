import { cn } from "@/lib/utils"
import React from "react"

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> { }

function AuroraBackgroundComponent({ className, ...props }: AuroraBackgroundProps) {
    return (
        <div
            className={cn(
                "pointer-events-none fixed inset-0 -z-[9999] overflow-hidden",
                "bg-slate-50 dark:bg-zinc-950",
                // Otimização: will-change avisa o browser para preparar a GPU
                "will-change-transform",
                className
            )}
            {...props}
        >
            <div className={cn(
                "absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob",
                "bg-emerald-300 dark:bg-emerald-500/20",
                // Otimização: backface-visibility previne flickering
                "backface-hidden transform-gpu translate-z-0"
            )} />
            <div className={cn(
                "absolute top-[30%] right-[10%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000",
                "bg-blue-300 dark:bg-purple-500/20",
                "backface-hidden transform-gpu translate-z-0"
            )} />
            <div className={cn(
                "absolute bottom-[10%] left-[30%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000",
                "bg-teal-300 dark:bg-teal-500/20",
                "backface-hidden transform-gpu translate-z-0"
            )} />
        </div>
    )
}

// O segredo: React.memo garante que este componente SÓ RENDERIZA UMA VEZ
export const AuroraBackground = React.memo(AuroraBackgroundComponent)
