import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/shared/Logo"
import { Check, Copy, Loader2, Lock, QrCode } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export function Checkout() {
    const isMobile = useMobile()
    const [step, setStep] = useState<'product' | 'payment' | 'success'>('product')
    const [isLoading, setIsLoading] = useState(false)

    // Mock product data since we don't have a real backend to fetch by ID
    // In a real app we would fetch product by linkId
    const product = {
        title: "Ebook: Marketing Digital 2.0",
        price: 97.00,
        description: "O guia definitivo para escalar suas vendas online em 2025."
    }

    const handleBuyClick = () => {
        setStep('payment')
    }

    const handleCopyPix = () => {
        navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Fulano de Tal6008BRASILIA62070503***6304E2CA")
        setIsLoading(true)
        // Simulate payment approval
        setTimeout(() => {
            setIsLoading(false)
            setStep('success')
        }, 2500)
    }

    const PaymentContent = (
        <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <QrCode className="w-48 h-48 text-slate-900" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-slate-500">Valor a pagar</p>
                    <p className="text-3xl font-bold text-slate-900">R$ {product.price.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-3">
                <Button className="w-full h-12 text-base" onClick={handleCopyPix} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verificando Pagamento...
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar Código Pix
                        </>
                    )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                    Ao copiar, abra o app do seu banco e escolha "Pix Copia e Cola".
                </p>
            </div>
        </div>
    )

    const SuccessContent = (
        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pagamento Aprovado!</h2>
            <p className="text-slate-500 max-w-xs">
                Seu acesso foi liberado. Você receberá os detalhes por email.
            </p>
            <Button className="w-full mt-4" onClick={() => window.location.href = "https://google.com"}>
                Acessar Produto
            </Button>
        </div>
    )

    if (step === 'product') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="mb-8">
                    <Logo className="w-8 h-8" textClassName="text-xl" />
                </div>
                <Card className="w-full max-w-md shadow-xl border-none overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Lock className="w-16 h-16 text-primary/40" />
                    </div>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{product.title}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="text-4xl font-bold text-primary">
                            R$ {product.price.toFixed(2)}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-slate-100 py-2 rounded-lg">
                            <Lock className="w-3 h-3" />
                            Pagamento 100% Seguro
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full text-lg h-14 animate-pulse" onClick={handleBuyClick}>
                            Comprar Agora
                        </Button>
                    </CardFooter>
                </Card>
                <p className="mt-8 text-xs text-slate-400">Powered by Libera.ai</p>
            </div>
        )
    }

    // Payment/Success Modal/Drawer
    if (isMobile) {
        return (
            <Sheet open={true} onOpenChange={() => { }}>
                <SheetContent side="bottom" className="rounded-t-xl pt-6">
                    <SheetHeader className="text-left">
                        <SheetTitle>{step === 'payment' ? 'Pagamento via Pix' : 'Sucesso'}</SheetTitle>
                    </SheetHeader>
                    {step === 'payment' ? PaymentContent : SuccessContent}
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Dialog open={true} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{step === 'payment' ? 'Pagamento via Pix' : 'Sucesso'}</DialogTitle>
                    <DialogDescription>
                        {step === 'payment' ? 'Escaneie o QR Code ou copie o código abaixo.' : ''}
                    </DialogDescription>
                </DialogHeader>
                {step === 'payment' ? PaymentContent : SuccessContent}
            </DialogContent>
        </Dialog>
    )
}
