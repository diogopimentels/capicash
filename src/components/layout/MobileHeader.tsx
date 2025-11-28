import { Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"

export function MobileHeader() {
    const navigate = useNavigate()

    return (
        <header className="flex h-16 items-center justify-between px-4 border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50 md:hidden">
            {/* Lado Esquerdo: Logo */}
            <div onClick={() => navigate('/')} className="cursor-pointer">
                <Logo size="small" showText={true} />
            </div>

            {/* Lado Direito: Ações */}
            <div className="flex items-center gap-2">
                {/* Botão de Settings (NOVO) */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/settings')}
                    className="text-zinc-500 dark:text-zinc-400 hover:bg-white/10"
                >
                    <Settings className="h-6 w-6" />
                </Button>

                {/* Toggle de Tema */}
                <ThemeToggle />
            </div>
        </header>
    )
}
