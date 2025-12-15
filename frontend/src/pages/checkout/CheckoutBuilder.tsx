import { ShoppingCart } from "lucide-react"

export function CheckoutBuilder() {
    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-3xl font-light text-white mb-8">Checkout Builder</h1>
            <div className="flex-1 glass-panel rounded-3xl flex flex-col items-center justify-center p-8 text-center border-white/5">
                <div className="bg-purple-500/10 p-6 rounded-full mb-6 ring-1 ring-purple-500/20">
                    <ShoppingCart className="w-12 h-12 text-purple-400" />
                </div>
                <h2 className="text-xl text-white font-medium mb-2">Editor de Checkout</h2>
                <p className="text-white/40 max-w-md">
                    Personalize a experiência de compra dos seus clientes com nosso editor visual de alta conversão.
                </p>
            </div>
        </div>
    )
}
