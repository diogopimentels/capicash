import { Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/Logo"
import { useAppStore } from "@/store/useAppStore"

export function MobileHeader() {
    const navigate = useNavigate()
    const logout = useAppStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        navigate('/auth/login')
    }

    return (
        <header className="flex h-16 items-center justify-between px-4 border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50 md:hidden">
            {/* Lado Esquerdo: Logo */}
            <div onClick={() => navigate('/')} className="cursor-pointer">
                <Logo size="small" showText={true} />
            </div>

            {/* Lado Direito: Ações */}
            <div className="flex items-center gap-1">
                {/* Settings */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/settings')}
                    className="text-zinc-500 dark:text-zinc-400"
                >
                    <Settings className="h-5 w-5" />
                </Button>

                {/* Logout (NOVO) */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <LogOut className="h-5 w-5" />
                </Button>

                {/* Separador visual opcional ou apenas o Theme Toggle */}
                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                {/* Toggle de Tema */}
                <ThemeToggle />
            </div>
        </header>
    )
}
