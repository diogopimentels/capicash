
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    LogOut,
    CreditCard,
    TrendingUp,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import { Logo } from "@/components/shared/Logo"
import { SidebarItem } from "./SidebarItem"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useClerk } from "@clerk/clerk-react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "Produtos", href: "/products" },
    { icon: ShoppingCart, label: "Checkout", href: "/checkout-builder" },
    { icon: TrendingUp, label: "Vendas", href: "/sales" },
    { icon: CreditCard, label: "Financeiro", href: "/finance" },
    { icon: Users, label: "Clientes", href: "/customers" },
    { icon: Settings, label: "Configurações", href: "/settings" },
]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const location = useLocation()
    const { signOut } = useClerk()

    const handleLogout = () => {
        signOut()
    }

    return (
        <TooltipProvider delayDuration={0}>
            <motion.div
                initial={false}
                animate={{
                    width: isCollapsed ? "80px" : "280px",
                }}
                className={cn(
                    "hidden md:flex flex-col fixed left-4 top-4 h-[calc(100vh-2rem)] z-50",
                    "glass rounded-[2rem] border-white/[0.08]", // Glass Formula
                    "transition-all duration-300 ease-in-out"
                )}
            >
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 mb-2 relative">
                    <div className={cn("transition-all duration-300", isCollapsed && "scale-0 opacity-0 absolute")}>
                        <Logo showText={true} />
                    </div>
                    {isCollapsed && (
                        <div className="scale-75">
                            <Logo showText={false} />
                        </div>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg z-50"
                    >
                        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2 scrollbar-none">
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            icon={item.icon}
                            label={item.label}
                            path={item.href}
                            isActive={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
                            collapsed={isCollapsed}
                        />
                    ))}
                </div>

                {/* Footer / User Profile */}
                <div className="p-6 space-y-4">
                    {!isCollapsed && (
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs font-medium text-white/40">App Mode</span>
                            <div className="scale-75 origin-right">
                                <ThemeToggle />
                            </div>
                        </div>
                    )}

                    <div className={cn(
                        "flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.06]",
                        isCollapsed ? "justify-center p-2 bg-transparent border-none" : ""
                    )}>
                        <Avatar className="h-10 w-10 border border-white/10 shadow-lg">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-emerald-900 text-emerald-100">CN</AvatarFallback>
                        </Avatar>

                        {!isCollapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate text-white">
                                    Admin User
                                </p>
                                <p className="text-xs text-white/40 truncate">
                                    admin@capicash.com
                                </p>
                            </div>
                        )}

                        {!isCollapsed && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
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

