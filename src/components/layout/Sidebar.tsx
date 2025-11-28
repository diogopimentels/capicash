

import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LayoutDashboard, Link as LinkIcon, DollarSign, LogOut, ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: LinkIcon, label: 'Meus Links', path: '/products' },
    { icon: DollarSign, label: 'Financeiro', path: '/finance' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
]

export function Sidebar() {
    const location = useLocation()
    const logout = useAppStore((state) => state.logout)
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <TooltipProvider>
            <motion.div
                initial={{ width: 256 }}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                    "hidden md:flex flex-col h-screen fixed left-0 top-0 z-20 border-r",
                    "bg-background/60 backdrop-blur-xl border-border/50 shadow-sm",
                    "transition-colors duration-300"
                )}
            >
                {/* Header */}
                <div className={cn("p-6 flex items-center relative", isCollapsed ? "justify-center" : "justify-between")}>
                    <div className={cn("transition-all duration-300", isCollapsed && "scale-90")}>
                        <Logo collapsed={isCollapsed} />
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "h-6 w-6 rounded-full border shadow-sm bg-background text-muted-foreground hover:text-foreground absolute -right-3 top-8 z-30",
                            "transition-transform duration-300 hover:scale-110"
                        )}
                    >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-2 mt-4">
                    {NAV_ITEMS.map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isActive={location.pathname === item.path}
                            collapsed={isCollapsed}
                        />
                    ))}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-border/50 space-y-4">
                    {!isCollapsed && (
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs font-medium text-muted-foreground">Tema</span>
                            <ThemeToggle />
                        </div>
                    )}

                    {isCollapsed && (
                        <div className="flex justify-center mb-2">
                            <ThemeToggle />
                        </div>
                    )}

                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-xl bg-muted/30 border border-border/50",
                        isCollapsed ? "justify-center p-2 bg-transparent border-none" : ""
                    )}>
                        <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">
                                    Admin User
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    admin@libera.ai
                                </p>
                            </div>
                        )}

                        {!isCollapsed && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={logout}>
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Sair</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    )
}
