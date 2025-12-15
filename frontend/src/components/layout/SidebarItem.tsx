import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
    icon: LucideIcon
    label: string
    path: string
    isActive: boolean
    collapsed: boolean
}

export function SidebarItem({ icon: Icon, label, path, isActive, collapsed }: SidebarItemProps) {
    return (
        <Link to={path} className={cn(
            "flex items-center gap-3 p-3 group cursor-pointer relative rounded-xl transition-all duration-300",
            isActive
                ? "bg-emerald-500/10"
                : "hover:bg-white/[0.05]"
        )}>
            {/* Active Indicator Bar */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            )}

            {/* Icon Container */}
            <div className={cn(
                "flex items-center justify-center transition-all duration-300 shrink-0",
                "w-8 h-8",
                isActive
                    ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "text-zinc-400 group-hover:text-white"
            )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            {/* Text (Only visible if expanded) */}
            {!collapsed && (
                <span className={cn(
                    "font-medium text-sm whitespace-nowrap overflow-hidden transition-all",
                    isActive
                        ? "text-emerald-100 font-semibold drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]"
                        : "text-zinc-400 group-hover:text-white"
                )}>
                    {label}
                </span>
            )}

            {/* Tooltip for Collapsed Sidebar */}
            {collapsed && (
                <div className="absolute left-16 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap shadow-xl translate-x-2 group-hover:translate-x-0">
                    {label}
                </div>
            )}
        </Link>
    )
}
