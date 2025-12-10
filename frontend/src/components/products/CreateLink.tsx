import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/lib/api"

interface CreateLinkProps {
    children?: React.ReactNode
}

export function CreateLink({ children }: CreateLinkProps) {
    const isMobile = useMobile()
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success("Link criado com sucesso!")
            setOpen(false)
            setTitle("")
            setPrice("")
        },
        onError: () => {
            toast.error("Erro ao criar link. Tente novamente.")
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.error("O título é obrigatório")
            return
        }

        // Replace comma with dot for parsing
        const priceValue = parseFloat(price.replace(",", "."))
        if (isNaN(priceValue) || priceValue <= 0) {
            toast.error("Insira um preço válido")
            return
        }

        // Convert to cents
        const priceCents = Math.round(priceValue * 100)

        mutate({
            title,
            priceCents,
            redirectUrl: 'https://google.com', // Placeholder for now, maybe add input later
        })
    }

    const FormContent = (
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid gap-2">
                <Label htmlFor="title" className="text-base">Título do Produto</Label>
                <Input
                    id="title"
                    placeholder="Ex: Ebook de Marketing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 text-lg"
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="price" className="text-base">Preço (R$)</Label>
                <Input
                    id="price"
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    placeholder="0,00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-12 text-lg font-bold"
                    required
                    step="0.01"
                />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-medium mt-2" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Gerar Link de Pagamento
            </Button>
        </form>
    )

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    {children || <Button><Plus className="mr-2 h-4 w-4" /> Criar Link</Button>}
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[20px] px-6 pb-8">
                    <SheetHeader className="text-left mb-4">
                        <SheetTitle className="text-2xl">Criar Novo Link</SheetTitle>
                        <SheetDescription className="text-base">
                            Preencha os dados para começar a vender.
                        </SheetDescription>
                    </SheetHeader>
                    {FormContent}
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button><Plus className="mr-2 h-4 w-4" /> Criar Link</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Novo Link</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do seu produto para gerar o checkout.
                    </DialogDescription>
                </DialogHeader>
                {FormContent}
            </DialogContent>
        </Dialog>
    )
}
