
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileDock } from './MobileDock'
import { MobileHeader } from './MobileHeader'
import { useAuth, useUser, useClerk } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { setupAPIClient } from '@/lib/api'
import { Toaster } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, ChevronRight } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CinematicLoading } from '../shared/CinematicLoading'

export function DashboardLayout() {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useAuth()
    const { isLoaded: isUserLoaded, user } = useUser()
    const { signOut } = useClerk()
    const location = useLocation()

    // Combine loading states
    const isLoaded = isAuthLoaded && isUserLoaded

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            setupAPIClient(getToken)

            // Sync user to backend
            const syncUser = async () => {
                try {
                    const token = await getToken()
                    await fetch('http://localhost:3000/users/sync', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: user.id,
                            email: user.primaryEmailAddress?.emailAddress,
                            name: user.fullName,
                            avatarUrl: user.imageUrl
                        })
                    })
                } catch (error) {
                    console.error("Failed to sync user", error)
                }
            }
            syncUser()
        }
    }, [isLoaded, isSignedIn, getToken, user])

    if (!isLoaded) {
        return <CinematicLoading />
    }

    if (!isSignedIn) {
        return <Navigate to="/auth/login" />
    }

    // Breadcrumbs Logic (Simple mapping)
    const getBreadcrumb = () => {
        const path = location.pathname.split('/')[1]
        switch (path) {
            case 'dashboard': return 'Visão Geral'
            case 'products': return 'Meus Links'
            case 'finance': return 'Financeiro'
            case 'settings': return 'Configurações'
            default: return 'Dashboard'
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] text-zinc-100 relative overflow-hidden selection:bg-emerald-500/30 font-sans">

            {/* 1. ATMOSPHERE (Background) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Deep Emerald Orb */}
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-900/40 rounded-full blur-[150px] animate-pulse duration-[10000ms]" />

                {/* Midnight Blue Orb */}
                <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-900/30 rounded-full blur-[150px] animate-pulse duration-[8000ms] delay-1000" />
            </div>

            {/* 2. LAYOUT CONTAINER */}
            <div className="relative z-10 flex h-screen overflow-hidden">

                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col relative overflow-hidden">

                    {/* Floating Header */}
                    <header className="h-24 px-8 flex items-center justify-between shrink-0">
                        {/* Breadcrumbs - Styled as a glass pill */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl">
                            <span className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Capicash</span>
                            <ChevronRight className="w-3 h-3 text-zinc-700" />
                            <span className="text-zinc-200 text-sm font-medium">{getBreadcrumb()}</span>
                        </div>

                        {/* User Profile - Glass Pill */}
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none">
                                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors cursor-pointer group">
                                        <Avatar className="h-8 w-8 border border-white/10 shadow-sm shrink-0">
                                            <AvatarImage src={user?.imageUrl} />
                                            <AvatarFallback className="bg-emerald-900 text-emerald-200 text-xs">
                                                {user?.firstName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="pr-3 hidden sm:block text-right">
                                            <p className="text-xs font-medium text-white leading-none group-hover:text-emerald-300 transition-colors">{user?.fullName}</p>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-white/10 text-zinc-200 backdrop-blur-xl rounded-xl">
                                    <DropdownMenuLabel>Sua Conta</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-white rounded-lg m-1" onClick={() => signOut()}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 pt-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
                        {/* Mobile Header Helper */}
                        <div className="md:hidden mb-6">
                            <MobileHeader />
                        </div>

                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Dock */}
            <div className="md:hidden">
                <MobileDock />
            </div>

            <Toaster theme="dark" position="bottom-right" className="font-sans" />
        </div>
    )
}
