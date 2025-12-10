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
        <Link to={path} className="flex items-center gap-3 p-2 group cursor-pointer relative">
            {/* 1. Icon Container (Always visible) */}
            <div className={cn(
                "flex items-center justify-center transition-all duration-300 rounded-xl shrink-0",
                // Fixed size for perfect centering
                "w-10 h-10",
                // Active State: Green Background + White Icon
                isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-emerald-500"
            )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            {/* 2. Text (Only visible if expanded) */}
            {!collapsed && (
                <span className={cn(
                    "font-medium text-sm whitespace-nowrap overflow-hidden transition-all",
                    isActive ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-500"
                )}>
                    {label}
                </span>
            )}

            {/* 3. Tooltip for Collapsed Sidebar */}
            {collapsed && (
                <div className="absolute left-14 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {label}
                </div>
            )}
        </Link>
    )
}
