import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    CreditCard,
    TrendingUp,
    Plus,
    MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateLink } from '@/components/products/CreateLink'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navItems = [
    { icon: LayoutDashboard, path: "/dashboard", label: "Dashboard" },
    { icon: Package, path: "/products", label: "Produtos" },
    { icon: TrendingUp, path: "/sales", label: "Vendas" },
    { icon: CreditCard, path: "/finance", label: "Financeiro" },
    // FAB goes here logic
    { icon: ShoppingCart, path: "/checkout-builder", label: "Checkout" },
    { icon: Users, path: "/customers", label: "Clientes" },
    { icon: Settings, path: "/settings", label: "Config" },
]

export function MobileDock() {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Layout configuration:
    // Left: 2 items
    // Center: FAB
    // Right: 1 item + More button
    const leftItems = navItems.slice(0, 2)
    const rightSideFirstItem = navItems[2]
    const hiddenItems = navItems.slice(3)

    const DockItem = ({ path, icon: Icon, onClick }: { path?: string, icon: any, label?: string, onClick?: () => void }) => {
        const isActive = path ? (location.pathname === path || location.pathname.startsWith(path + '/')) : false

        const content = (
            <div className={cn(
                "relative flex items-center justify-center w-12 h-12 transition-all duration-300",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}>
                {/* Spotlight Effect for Active Tab */}
                {isActive && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/10 rounded-full blur-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}

                <Icon className="relative z-10 w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
            </div>
        )

        if (onClick) {
            return (
                <button onClick={onClick} className="flex flex-col items-center justify-center">
                    {content}
                </button>
            )
        }

        return (
            <Link to={path!} className="flex flex-col items-center justify-center">
                {content}
            </Link>
        )
    }

    return (
        <>
            {/* Overlay for closing menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
                {/* Main Floating Glass Dock - Spatial Island */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="
                        pointer-events-auto
                        relative flex items-center justify-evenly w-full h-20 rounded-full
                        bg-black/40 backdrop-blur-3xl
                        border border-white/10 
                        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]
                    "
                >
                    {/* Left Items */}
                    <div className="flex items-center gap-2">
                        {leftItems.map((item) => (
                            <DockItem key={item.path} {...item} />
                        ))}
                    </div>

                    {/* Central "Create" Action - Floating Spatial Button */}
                    <div className="flex-none -mt-8 px-2">
                        <CreateLink>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.1 }}
                                className="
                                    flex items-center justify-center w-14 h-14
                                    rounded-full 
                                    bg-gradient-to-t from-emerald-600 to-emerald-400
                                    text-white 
                                    shadow-[0_0_20px_rgba(16,185,129,0.5)]
                                    border border-emerald-400/20
                                "
                            >
                                <Plus className="w-7 h-7" strokeWidth={2.5} />
                            </motion.button>
                        </CreateLink>
                    </div>

                    {/* Right Items */}
                    <div className="flex items-center gap-2">
                        <DockItem {...rightSideFirstItem} />

                        <div className="relative">
                            <DockItem
                                icon={MoreHorizontal}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            />

                            {/* Overflow Menu */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className="
                                            absolute bottom-full right-0 mb-6 -mr-2
                                            flex flex-col gap-1 p-2
                                            min-w-[160px]
                                            bg-black/90 backdrop-blur-xl
                                            border border-white/10 rounded-2xl
                                            shadow-2xl shadow-black/80
                                            overflow-hidden
                                        "
                                    >
                                        {hiddenItems.map((item) => {
                                            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                                        isActive ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                                                    )}
                                                >
                                                    <item.icon className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
