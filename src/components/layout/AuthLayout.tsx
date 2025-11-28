import { Outlet, Navigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { Logo } from '@/components/shared/Logo'
import { motion } from 'framer-motion'

export function AuthLayout() {
    const isAuthenticated = useAppStore((state) => state.isAuthenticated)

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Aurora Background */}
            <div className="absolute inset-0 w-full h-full">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-emerald-500/20 blur-[120px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 100, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="flex justify-center mb-8">
                    <Logo size="large" showText={true} textClassName="text-white" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl shadow-2xl shadow-emerald-500/20 p-8"
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    )
}
