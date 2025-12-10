import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    size?: "small" | "default" | "large"
    showText?: boolean
    textClassName?: string
    forceTheme?: "light" | "dark"
}

export function Logo({ className, size = "default", showText = true, textClassName, forceTheme }: LogoProps) {
    const { theme: globalTheme } = useTheme()

    // Se forceTheme existir, usa ele. Se não, usa o tema global.
    // Fallback: se global for 'system', assume 'light' para simplificar ou mantenha lógica anterior.
    const activeTheme = forceTheme || (globalTheme === 'system' ? 'light' : globalTheme)

    // Mapeamento de Tamanhos
    const dimensions = {
        small: { img: "h-6", text: "text-lg" },
        default: { img: "h-8", text: "text-xl" },
        large: { img: "h-16", text: "text-4xl" } // Login bem grande
    }

    const { img: imgSize, text: textSize } = dimensions[size]

    // Se o tema ativo for light (fundo claro), usamos a logo 'white.png' (que contem a arte escura/colorida)
    // Se o tema ativo for dark (fundo escuro), usamos a logo 'black.png' (que contem a arte clara)
    const logoSrc = activeTheme === 'light' ? "/logo/white.png" : "/logo/black.png"

    // Cor do texto baseada no tema ativo
    const textColor = activeTheme === 'light' ? "text-zinc-900" : "text-zinc-50"

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
                    "font-bold tracking-tight font-sans",
                    textSize,
                    textColor,
                    textClassName
                )}>
                    Capicash
                </span>
            )}
        </div>
    )
}
