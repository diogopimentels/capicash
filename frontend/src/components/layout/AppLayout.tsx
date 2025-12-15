import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileDock } from './MobileDock'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { MobileHeader } from './MobileHeader'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { setupAPIClient } from '@/lib/api'
import { CapicashLoader } from '@/components/shared/CapicashLoader'

export function AppLayout() {
    const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useAuth()
    const { isLoaded: isUserLoaded, user } = useUser()

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
        return <div className="flex h-screen items-center justify-center bg-zinc-950"><CapicashLoader /></div>
    }

    if (!isSignedIn) {
        return <Navigate to="/auth/login" />
    }

    return (
        <ThemeProvider>
            <div className="min-h-screen flex relative overflow-hidden bg-transparent">
                {/* Global Aurora Background */}
                {/* Global Aurora Background is in App.tsx */}


                {/* Desktop Sidebar (Floating Dock) */}
                <Sidebar />

                {/* Main Content Area */}
                {/* Updated Margin Left for Floating Sidebar: 260px width + 16px left + 24px gap = ~300px */}
                {/* Added overflow-y-auto to handle scroll inside main area if needed, or stick to window scroll */}
                <main className="flex-1 md:ml-[300px] min-h-screen pb-24 md:pb-8 transition-all duration-300 relative z-10 bg-transparent">
                    {/* Mobile Header */}
                    <MobileHeader />

                    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Dock */}
                <MobileDock />
                <Toaster />
            </div>
        </ThemeProvider>
    )
}
