import { useEffect } from 'react'
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { api, setupAPIClient } from "@/lib/api"
import { CinematicLoading } from '@/components/shared/CinematicLoading'
import { DollarSign, ShoppingBag, TrendingUp, ArrowUpRight } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { cn } from "@/lib/utils"

export function OverviewPage() {
    const { getToken, isLoaded } = useAuth()

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
    })

    if (isLoading) {
        return <CinematicLoading />
    }

    const metrics = data || {
        availableBalance: 0,
        totalRevenue: 0,
        salesCount: 0,
        ticketMedio: 0,
        salesChart: [],
        recentSales: []
    }

    // Fallback calculation
    const averageTicket = metrics.salesCount > 0 ? metrics.totalRevenue / metrics.salesCount : 0

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value / 100)
    }

    const chartData = metrics.salesChart.length > 0 ? metrics.salesChart : [
        { date: 'Seg', value: 0 },
        { date: 'Ter', value: 0 },
        { date: 'Qua', value: 0 },
        { date: 'Qui', value: 0 },
        { date: 'Sex', value: 0 },
        { date: 'Sab', value: 0 },
        { date: 'Dom', value: 0 },
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-10">

            {/* BENTO GRID MAIN SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. MAIN CHART (2/3 Width) */}
                <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden group">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-light text-zinc-900 dark:text-white tracking-wide">Performance</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-4xl font-semibold text-emerald-600 dark:text-emerald-400 font-sans tracking-tight">{formatMoney(metrics.totalRevenue)}</span>
                                    <span className="px-2 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">+18%</span>
                                </div>
                            </div>

                            {/* Time Filters */}
                            <div className="hidden sm:flex gap-2 p-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.05]">
                                {['7D', '30D', '3M', '1Y'].map((t) => (
                                    <button key={t} className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                                        t === '7D' ? "bg-white dark:bg-emerald-500 text-zinc-900 dark:text-black shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                    )}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="h-[350px] w-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} horizontal={false} opacity={0} />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#52525b', fontSize: 12 }}
                                        dy={20}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', backdropFilter: 'blur(10px)' }}
                                        itemStyle={{ color: '#34d399' }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                        formatter={(value: number) => [`R$ ${value}`, '']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#34d399"
                                        strokeWidth={3}
                                        fill="url(#colorValue)"
                                        fillOpacity={1}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 2. METRIC CARDS COLUMN (1/3 Width) */}
                <div className="flex flex-col gap-6">
                    <GlassMetricCard
                        title="Vendas Totais"
                        value={metrics.salesCount.toString()}
                        icon={ShoppingBag}
                        color="blue"
                    />
                    <GlassMetricCard
                        title="Ticket Médio"
                        value={formatMoney(averageTicket)}
                        icon={DollarSign}
                        color="purple"
                    />
                    <div className="flex-1 bg-white/60 dark:bg-white/[0.04] backdrop-blur-3xl border border-zinc-200 dark:border-white/[0.08] rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-center items-center text-center group min-h-[180px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] animate-pulse">
                            <TrendingUp className="w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-zinc-600 dark:text-zinc-400 font-medium mb-1">Crescimento</h4>
                        <p className="text-3xl font-light text-zinc-900 dark:text-white">+124.5%</p>
                        <p className="text-emerald-600 dark:text-emerald-500/60 text-xs mt-2 font-mono">EM RELAÇÃO AO MÊS PASSADO</p>
                    </div>
                </div>
            </div>

            {/* 3. TRANSACTIONS TABLE (Full Width Glass) */}
            <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-3xl border border-zinc-200 dark:border-white/[0.08] rounded-[2.5rem] overflow-hidden p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-light text-zinc-900 dark:text-white ml-2">Transações Recentes</h3>
                    <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest px-4 py-2 hover:bg-emerald-500/10 rounded-full transition-all">
                        Ver Todas
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <tbody className="space-y-4">
                            {metrics.recentSales.length > 0 ? (
                                metrics.recentSales.map((sale: any, index: number) => (
                                    <tr key={index} className="group hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all duration-300 rounded-2xl block border-b border-dashed border-zinc-200 dark:border-white/5 last:border-0 hover:scale-[1.01] hover:shadow-lg">

                                        {/* "Cellular" Layout for Rows */}
                                        <td className="p-4 pl-6 w-full md:w-[30%] block md:table-cell">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-black border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-bold text-xs shadow-inner shrink-0">
                                                    {sale.customerName?.[0] || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-zinc-900 dark:text-zinc-200 font-medium text-sm truncate">{sale.customerName}</div>
                                                    <div className="text-zinc-500 dark:text-zinc-600 text-xs font-mono mt-0.5 truncate">{sale.email || 'email@oculto.com'}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 w-full md:w-[20%] text-zinc-500 dark:text-zinc-400 text-sm block md:table-cell pl-20 md:pl-4">
                                            {sale.productName || 'Produto Premium'}
                                        </td>

                                        <td className="p-4 w-full md:w-[20%] block md:table-cell pl-20 md:pl-4">
                                            <StatusBadge status={sale.status} />
                                        </td>

                                        <td className="p-4 w-full md:w-[20%] text-left md:text-right font-medium text-emerald-600 dark:text-emerald-300 text-base tracking-tight block md:table-cell pl-20 md:pl-4">
                                            {formatMoney(sale.amount)}
                                        </td>

                                        <td className="p-4 pr-6 w-full md:w-[10%] text-right hidden md:table-cell">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-emerald-500 hover:text-white ml-auto">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td className="p-8 text-center text-zinc-600 block">Nenhuma venda encontrada.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function GlassMetricCard({ title, value, icon: Icon, color }: any) {
    const colors: Record<string, string> = {
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        emerald: "bg-emerald-500"
    }
    const glow = colors[color] || colors.emerald

    return (
        <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-3xl border border-zinc-200 dark:border-white/[0.08] rounded-[2rem] p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${glow} opacity-10 dark:opacity-20 blur-[40px] group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${glow}/10 border border-zinc-200/50 dark:border-white/5 flex items-center justify-center text-zinc-900 dark:text-white shadow-sm dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]`}>
                        <Icon className="w-5 h-5 text-zinc-700 dark:text-white" strokeWidth={1.5} />
                    </div>
                </div>

                <h4 className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-2">{title}</h4>
                <div className="text-4xl font-extralight text-zinc-900 dark:text-white font-sans tracking-tighter">
                    {value}
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
            status === 'paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
        )}>
            {status}
        </span>
    )
}
