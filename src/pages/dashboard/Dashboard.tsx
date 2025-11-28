import { DollarSign, CreditCard, Activity, Link as LinkIcon } from "lucide-react"
import { KPICard } from "@/components/shared/KPICard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { RecentSales } from "@/components/dashboard/RecentSales"
import { useAppStore } from "@/store/useAppStore"

export function Dashboard() {
    const balance = useAppStore((state) => state.balance)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Saldo Disponível"
                    value={`R$ ${balance.toFixed(2)}`}
                    icon={DollarSign}
                    description="+20.1% este mês"
                />
                <KPICard
                    title="Vendas Hoje"
                    value="R$ 1.250,00"
                    icon={CreditCard}
                    description="+15 vendas"
                />
                <KPICard
                    title="Total Recebido"
                    value="R$ 45.231,89"
                    icon={Activity}
                    description="Desde o início"
                />
                <KPICard
                    title="Links Ativos"
                    value="12"
                    icon={LinkIcon}
                    description="+3 novos links"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <SalesChart />
                </div>
                <div className="col-span-3">
                    <RecentSales />
                </div>
            </div>
        </div>
    )
}
