import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileDock } from './MobileDock'
import { useAppStore } from '@/store/useAppStore'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { MobileHeader } from './MobileHeader'
import { motion } from 'framer-motion'



export function AppLayout() {
    const isAuthenticated = useAppStore((state) => state.isAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" />
    }

    return (
        <ThemeProvider>
            <div className="min-h-screen flex relative overflow-hidden bg-transparent">
                {/* Global Aurora Background */}
                <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-background">
                    {/* Dark Mode Blobs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-emerald-500/20 blur-[120px] rounded-full mix-blend-screen dark:block hidden"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, 100, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen dark:block hidden"
                    />

                    {/* Light Mode Blobs (Clean Tech) */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 45, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-emerald-300/30 blur-[100px] rounded-full mix-blend-multiply dark:hidden block"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, 50, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[10%] -right-[10%] w-[50vw] h-[50vw] bg-blue-300/30 blur-[100px] rounded-full mix-blend-multiply dark:hidden block"
                    />
                </div>

                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 md:ml-64 min-h-screen pb-24 md:pb-8 transition-all duration-300 relative z-10 bg-transparent">
                    {/* Mobile Header */}
                    <MobileHeader />

                    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Dock */}
                <MobileDock />
                <Toaster />
            </div>
        </ThemeProvider>
    )
}
