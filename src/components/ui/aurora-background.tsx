import { cn } from "@/lib/utils"

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AuroraBackground({ className, ...props }: AuroraBackgroundProps) {
    return (
        <div
            className={cn(
                "pointer-events-none fixed inset-0 -z-[9999] overflow-hidden",
                // Light Mode: Brisa suave Verde/Azul
                "bg-slate-50 dark:bg-zinc-950",
                className
            )}
            {...props}
        >
            <div className={cn(
                "absolute top-[20%] left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob",
                "bg-emerald-300 dark:bg-emerald-500/30"
            )} />
            <div className={cn(
                "absolute top-[30%] right-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-2000",
                "bg-blue-300 dark:bg-purple-500/30"
            )} />
            <div className={cn(
                "absolute bottom-[10%] left-[30%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob animation-delay-4000",
                "bg-teal-300 dark:bg-teal-500/30"
            )} />
        </div>
    )
}
