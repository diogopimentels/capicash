import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    size?: "small" | "default" | "large"
    showText?: boolean
}

export function Logo({ className, size = "default", showText = true }: LogoProps) {
    const { theme } = useTheme()

    // Mapeamento de Tamanhos
    const dimensions = {
        small: { img: "h-6", text: "text-lg" },
        default: { img: "h-8", text: "text-xl" },
        large: { img: "h-16", text: "text-4xl" } // Login bem grande
    }

    const { img: imgSize, text: textSize } = dimensions[size]
    const logoSrc = theme === 'light' ? "/logo/white.png" : "/logo/black.png"

    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* 1. O Ícone (Capivara) */}
            <img
                src={logoSrc}
                alt="Capicash"
                className={cn("w-auto object-contain transition-all", imgSize)}
            />

            {/* 2. O Texto (Capicash) - Renderizado Condicionalmente */}
            {showText && (
                <span className={cn(
                    "font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans",
                    textSize
                )}>
                    Capicash
                </span>
            )}
        </div>
    )
}
