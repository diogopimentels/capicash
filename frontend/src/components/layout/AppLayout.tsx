import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileDock } from './MobileDock'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { MobileHeader } from './MobileHeader'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { setupAPIClient } from '@/lib/api'

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
                    // Aviso visual se a sincronização falhar, pois isso impede criação de links
                    // toast.error("Erro ao sincronizar conta. Tente recarregar a página.", {
                    //     description: "Se o erro persistir, faça login novamente."
                    // })
                    // Vamos tentar forçar o reload se falhar muito
                }
            }
            syncUser()
        }
    }, [isLoaded, isSignedIn, getToken, user])

    if (!isLoaded) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>
    }

    if (!isSignedIn) {
        return <Navigate to="/auth/login" />
    }

    return (
        <ThemeProvider>
            <div className="min-h-screen flex relative overflow-hidden bg-transparent">
                {/* Global Aurora Background */}
                {/* Global Aurora Background is in App.tsx */}


                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 md:ml-64 min-h-screen pb-24 md:pb-8 transition-all duration-300 relative z-10 bg-transparent">
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
