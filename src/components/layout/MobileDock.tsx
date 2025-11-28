import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, DollarSign, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateLink } from '@/components/products/CreateLink'
import { Button } from '@/components/ui/button'

export function MobileDock() {
    const location = useLocation()

    const DockItem = ({ path, icon: Icon }: { path: string, icon: any }) => {
        const isActive = location.pathname === path
        return (
            <Link
                to={path}
                className="flex flex-col items-center justify-center gap-1"
            >
                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                    isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "text-muted-foreground hover:bg-muted/50"
                )}>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
            </Link>
        )
    }

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />

            <div className="relative flex items-center justify-around h-16 px-2 rounded-2xl">
                <DockItem path="/dashboard" icon={LayoutDashboard} />

                {/* Central FAB for Create Link */}
                <div className="-mt-12">
                    <CreateLink>
                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full shadow-xl bg-emerald-500 hover:bg-emerald-600 text-white border-[6px] border-background transition-transform active:scale-95"
                        >
                            <Plus className="w-8 h-8" strokeWidth={2.5} />
                        </Button>
                    </CreateLink>
                </div>

                <DockItem path="/finance" icon={DollarSign} />
            </div>
        </div>
    )
}
