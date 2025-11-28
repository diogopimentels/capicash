import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    textClassName?: string
    collapsed?: boolean
}

export function Logo({ className = "w-6 h-6", textClassName = "text-xl", collapsed = false }: LogoProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2 rounded-lg transition-all">
                <Zap className={cn("text-emerald-500 fill-current", className)} />
            </div>
            {!collapsed && (
                <span className={cn(
                    "font-bold tracking-tight transition-opacity duration-300",
                    "text-zinc-900 dark:text-zinc-50",
                    textClassName
                )}>
                    Libera.ai
                </span>
            )}
        </div>
    )
}
