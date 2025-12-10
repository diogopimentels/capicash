import { CreateLink } from "@/components/products/CreateLink"
import { ProductList } from "@/components/products/ProductList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getProducts } from "@/lib/api"

export function Products() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Meus Links</h2>
                    <p className="text-muted-foreground">
                        Gerencie seus produtos e links de pagamento.
                    </p>
                </div>
                <div className="hidden md:block">
                    <CreateLink>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Novo Link
                        </Button>
                    </CreateLink>
                </div>
            </div>

            {isLoading ? (
                <div className="p-8 text-center">Carregando produtos...</div>
            ) : (
                <ProductList products={products || []} />
            )}
        </div>
    )
}
