import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentSalesProps {
    sales: {
        id: string
        customerName: string
        customerEmail: string
        amount: number
        avatar: string
    }[]
}

export function RecentSales({ sales }: RecentSalesProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {sales.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma venda recente.</p>}
                    {sales.map((sale) => (
                        <div key={sale.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={sale.avatar} alt="Avatar" />
                                <AvatarFallback>{sale.customerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {sale.customerEmail}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-primary">
                                +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
