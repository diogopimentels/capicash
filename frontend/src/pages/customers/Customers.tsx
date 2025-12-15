import { Users } from "lucide-react"

export function Customers() {
    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-3xl font-light text-white mb-8">Clientes</h1>
            <div className="flex-1 glass-panel rounded-3xl flex flex-col items-center justify-center p-8 text-center border-white/5">
                <div className="bg-blue-500/10 p-6 rounded-full mb-6 ring-1 ring-blue-500/20">
                    <Users className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-xl text-white font-medium mb-2">Gestão de Clientes</h2>
                <p className="text-white/40 max-w-md">
                    O CRM integrado para gerenciar sua base de leads e clientes fiéis estará disponível em breve.
                </p>
            </div>
        </div>
    )
}
