import { DollarSign, Wallet, ArrowUpRight, ArrowDownRight, QrCode, Activity, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { api, setupAPIClient } from "@/lib/api";
import { useEffect } from "react"
import { CapicashLoader } from "@/components/shared/CapicashLoader"
import { useUserSync } from "@/hooks/use-user-sync"
import { useAuth } from "@clerk/clerk-react"
import { KPICard } from "@/components/shared/KPICard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { RecentSales } from "@/components/dashboard/RecentSales"

export function Dashboard() {
    const { getToken, isLoaded } = useAuth()

    // 🔥 HOOK DE RECUPERAÇÃO DE CONTA (Auto-Sync)
    useUserSync();

    // Configura o Axios
    useEffect(() => {
        if (isLoaded) {
            setupAPIClient(getToken)
        }
    }, [isLoaded, getToken])

    const { data, isLoading } = useQuery({
        queryKey: ['metrics'],
        queryFn: async () => {
            const response = await api.get('/users/me/metrics')
            return response.data
        },
        enabled: isLoaded,
        retry: 1, // Tenta mais uma vez se falhar antes de desistir
    })

    const formatMoney = (cents: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(cents / 100)
    }

    /* 
       Não bloqueamos mais a UI com "Syncing..." 
       Deixamos o Skeleton/Loader padrão rodar enquanto o useUserSync + useQuery resolvem.
    */

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center"><CapicashLoader /></div>
    }

    // Default safe metrics
    const metrics = data || {
        availableBalance: 0,
        totalRevenue: 0,
        activeLinks: 0,
        salesCount: 0,
        salesChart: [],
        recentSales: []
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard title="Saldo Disponível" value={formatMoney(metrics.availableBalance)} icon={DollarSign} description="Saldo atual" />
                <KPICard title="Total Recebido" value={formatMoney(metrics.totalRevenue)} icon={Activity} description="Desde o início" />
                <KPICard title="Links Ativos" value={metrics.activeLinks.toString()} icon={LinkIcon} description="Produtos ativos" />
                <KPICard title="Vendas Realizadas" value={metrics.salesCount?.toString() || "0"} icon={Wallet} description="Vendas aprovadas" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <SalesChart data={metrics.salesChart} />
                </div>
                <div className="col-span-3">
                    <RecentSales sales={metrics.recentSales} />
                </div>
            </div>
        </div>
    )
}
