import { useMobile } from "@/hooks/use-mobile"
import type { Product } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Package, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductListProps {
    products: Product[]
}

export function ProductList({ products }: ProductListProps) {
    const isMobile = useMobile()

    if (products.length === 0) {
        return (
            <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Nenhum link criado</h3>
                    <p className="text-muted-foreground text-sm">Crie seu primeiro produto para começar a vender.</p>
                </div>
            </div>
        )
    }

    const getProductLink = (slug: string) => {
        return `${window.location.origin}/p/${slug}`
    }

    if (isMobile) {
        return (
            <div className="space-y-4 pb-24">
                {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden bg-card border-border/50 shadow-sm active:scale-[0.98] transition-transform">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base truncate">{product.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                    R$ {(product.priceCents / 100).toFixed(2)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    (product.sales || 0) > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                )}>
                                    {product.sales || 0} vendas
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Vendas</TableHead>
                        <TableHead>Receita</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                        <Package className="w-4 h-4 text-primary" />
                                    </div>
                                    {product.title}
                                </div>
                            </TableCell>
                            <TableCell>R$ {(product.priceCents / 100).toFixed(2)}</TableCell>
                            <TableCell>{product.sales || 0}</TableCell>
                            <TableCell className="text-emerald-600 font-medium">
                                R$ {(product.revenue || 0).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(getProductLink(product.slug))}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}
