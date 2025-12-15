
import { Logo } from "@/components/shared/Logo"
import { motion } from "framer-motion"

export function CinematicLoading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-3xl">
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8],
                    filter: [
                        "drop-shadow(0 0 0px rgba(16, 185, 129, 0))",
                        "drop-shadow(0 0 30px rgba(16, 185, 129, 0.5))",
                        "drop-shadow(0 0 0px rgba(16, 185, 129, 0))"
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                {/* Capivara Logo */}
                <Logo className="w-32 h-32" forceTheme="dark" showText={false} />

                {/* Breathing ring */}
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20" />
            </motion.div>
        </div>
    )
}
