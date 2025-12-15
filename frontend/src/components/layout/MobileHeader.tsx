import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Logo } from "@/components/shared/Logo"
import { useUser } from "@clerk/clerk-react"

export function MobileHeader() {
    const navigate = useNavigate()
    const { user } = useUser()

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 md:hidden">
            {/* Left: Identity */}
            <div
                onClick={() => navigate('/')}
                className="cursor-pointer drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] filter"
            >
                <Logo size="small" showText={true} />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative flex h-11 w-11 items-center justify-center rounded-full active:scale-95 transition-transform">
                    <Bell className="h-6 w-6 text-zinc-400" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-black" />
                </button>

                {/* User Avatar */}
                <button
                    onClick={() => navigate('/settings')}
                    className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white/10 active:scale-95 transition-transform"
                >
                    {user?.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt="User"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-emerald-500" />
                    )}
                </button>
            </div>
        </header>
    )
}
