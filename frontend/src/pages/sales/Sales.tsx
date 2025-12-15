import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Package, User, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useQuery } from '@tanstack/react-query'
import { salesService } from '@/services/sales'
import { CinematicLoading } from '@/components/shared/CinematicLoading'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Sales() {
    const { data: sales, isLoading, isError, error } = useQuery({
        queryKey: ['sales'],
        queryFn: salesService.getSales
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatMoney = (amountCents: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amountCents / 100)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Aprovada</Badge>
            case 'pending': return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Pendente</Badge>
            case 'failed': return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Falhou</Badge>
            default: return <Badge variant="outline">Desconhecido</Badge>
        }
    }

    // Helper for Mobile Status Dot
    const getStatusDot = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500'
            case 'pending': return 'bg-yellow-500'
            case 'failed': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const isEmpty = !isLoading && !isError && (!sales || sales.length === 0)

    if (isLoading) {
        return <CinematicLoading />
    }

    if (isError) {
        return (
            <div className="p-6">
                <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro ao carregar vendas</AlertTitle>
                    <AlertDescription>
                        Não foi possível buscar suas transações. Tente novamente mais tarde.
                        <br />
                        <span className="text-xs opacity-50">{(error as Error)?.message}</span>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-32">
            {/* Header Comum */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white/90">Minhas Vendas</h2>
                    <p className="text-zinc-400">
                        Acompanhe todas as transações.
                    </p>
                </div>
            </div>

            {/* --- MOBILE SEARCH BAR --- */}
            <div className="md:hidden relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                    placeholder="Buscar transação..."
                    className="
                        pl-12 h-12 rounded-full
                        bg-white/5 border-white/5 
                        text-white placeholder:text-zinc-600
                        focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:bg-white/10
                        transition-all
                    "
                />
            </div>

            {/* Empty State */}
            {isEmpty && (
                <div className="flex flex-col items-center justify-center py-20 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <Package className="w-16 h-16 text-zinc-600 mb-4" strokeWidth={1} />
                    <h3 className="text-xl font-medium text-white mb-2">Nenhuma venda ainda</h3>
                    <p className="text-zinc-500 text-center max-w-sm">
                        Suas vendas aparecerão aqui assim que seus produtos começarem a ser vendidos.
                    </p>
                </div>
            )}

            {/* --- MOBILE VIEW (Cards List) --- */}
            {!isEmpty && (
                <div className="md:hidden space-y-3">
                    {sales?.map((sale) => (
                        <div
                            key={sale.id}
                            className="
                                relative flex items-center justify-between p-4
                                bg-white/[0.03] border border-white/[0.06]
                                rounded-2xl
                                active:scale-[0.98] transition-transform
                            "
                        >
                            <div className="flex items-center gap-4 overflow-hidden">
                                {/* Icon Wrapper */}
                                <div className="flex-none flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 text-zinc-400 overflow-hidden">
                                    {sale.productImage ? (
                                        <img src={sale.productImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-5 h-5" strokeWidth={1.5} />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-white font-medium truncate pr-2">
                                        {sale.product}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                        <User className="w-3 h-3" />
                                        <span className="truncate">{sale.customer}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Value & Status */}
                            <div className="flex-none flex flex-col items-end gap-1 pl-2">
                                <span className="text-emerald-400 font-bold whitespace-nowrap">
                                    {formatMoney(sale.amount)}
                                </span>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(sale.status)}`} />
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                                        {sale.status === 'completed' ? 'Pago' : sale.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- DESKTOP VIEW (Table) --- */}
            {!isEmpty && (
                <Card className="hidden md:block glass-panel border-white/5 bg-black/40">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">Transações Recentes</CardTitle>
                            <div className="relative w-full max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                    placeholder="Buscar venda..."
                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-white/5">
                                    <TableHead className="text-white/60">Data</TableHead>
                                    <TableHead className="text-white/60">Cliente</TableHead>
                                    <TableHead className="text-white/60">Produto</TableHead>
                                    <TableHead className="text-white/60">Status</TableHead>
                                    <TableHead className="text-right text-white/60">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales?.map((sale) => (
                                    <TableRow key={sale.id} className="hover:bg-white/[0.02] border-white/5">
                                        <TableCell className="text-white/80 font-medium">{formatDate(sale.date)}</TableCell>
                                        <TableCell className="text-white/80">{sale.customer}</TableCell>
                                        <TableCell className="text-white/80">{sale.product}</TableCell>
                                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                                        <TableCell className="text-right text-white font-medium">
                                            {formatMoney(sale.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
