import { motion } from "framer-motion"
import { Logo } from "@/components/shared/Logo"

export function CapicashLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Glow Effect */}
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full"
                />

                {/* Logo 1 (Dark Mode / Light Icon) */}
                <motion.div
                    animate={{ opacity: [1, 0, 1], scale: [1, 0.95, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Logo showText={false} size="large" forceTheme="dark" />
                </motion.div>

                {/* Logo 2 (Light Mode / Dark Icon) */}
                <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [0.95, 1, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Logo showText={false} size="large" forceTheme="light" />
                </motion.div>
            </div>
        </div>
    )
}
