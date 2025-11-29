import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center px-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <div className="bg-red-500/10 p-4 rounded-full">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    Página não encontrada
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                    O link que você tentou acessar não existe ou foi removido.
                </p>
                <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    Voltar para o Início
                </Button>
            </div>
        </div>
    )
}
