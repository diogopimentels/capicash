import { Outlet, Navigate } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { motion } from 'framer-motion'
import { useAuth } from '@clerk/clerk-react'

export function AuthLayout() {
    const { isSignedIn, isLoaded } = useAuth()

    if (isLoaded && isSignedIn) {
        return <Navigate to="/dashboard" />
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Static Gradient for Atmosphere (Cheaper than animated blobs) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />


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
