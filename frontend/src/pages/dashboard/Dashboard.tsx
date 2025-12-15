import { DollarSign, CreditCard, Activity, Link as LinkIcon } from "lucide-react"
import { KPICard } from "@/components/shared/KPICard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { RecentSales } from "@/components/dashboard/RecentSales"
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { api, setupAPIClient } from "@/lib/api"
import { useEffect } from "react"
import { CapicashLoader } from "@/components/shared/CapicashLoader"

export function Dashboard() {
    const { getToken, isLoaded } = useAuth()

    // Configura o Axios com o token atual
    useEffect(() => {
        if (isLoaded) {
            setupAPIClient(getToken)
        }
    }, [isLoaded, getToken])

    // Busca os dados
    const { data, isLoading } = useQuery({
        queryKey: ['metrics'],
        queryFn: async () => {
            const response = await api.get('/users/me/metrics')
            return response.data
        },
        enabled: isLoaded, // Só roda se o Clerk carregou
    })

    // Função para formatar dinheiro
    const formatMoney = (cents: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(cents / 100)
    }

    if (isLoading) {
        return <div className="flex h-[50vh] items-center justify-center"><CapicashLoader /></div>
    }

    // Dados reais ou Zero (se falhar/novo)
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
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Saldo Disponível"
                    value={formatMoney(metrics.availableBalance)}
                    icon={DollarSign}
                    description="Saldo atual"
                />
                <KPICard
                    title="Vendas Hoje"
                    value={formatMoney(0)}
                    icon={CreditCard}
                    description="0 vendas"
                />
                <KPICard
                    title="Total Recebido"
                    value={formatMoney(metrics.totalRevenue)}
                    icon={Activity}
                    description="Desde o início"
                />
                <KPICard
                    title="Links Ativos"
                    value={metrics.activeLinks.toString()}
                    icon={LinkIcon}
                    description="Produtos ativos"
                />
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

