import { useState } from "react"
import { useSignIn } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Login() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            })

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                navigate("/dashboard")
            } else {
                console.log(result)
                setError("Erro no login. Verifique suas credenciais.")
            }
        } catch (err: any) {
            console.error("Login error", err)
            const errorData = err.errors?.[0]
            const code = errorData?.code || ""
            const msg = errorData?.message || ""

            if (code === "form_identifier_not_found") {
                setError("Conta não encontrada.")
            } else if (code === "form_password_incorrect") {
                setError("Senha incorreta.")
            } else if (msg.toLowerCase().includes("strategy") || msg.toLowerCase().includes("password")) {
                setError("Email ou senha incorretos.")
            } else if (msg.toLowerCase().includes("not found")) {
                setError("Conta não encontrada.")
            } else {
                setError(msg || "Erro ao fazer login")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">Bem-vindo (a)</h1>
                <p className="text-zinc-400">Entre na sua conta para gerenciar seus links</p>
            </div>

            {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-11"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                        <Link to="#" className="text-sm text-emerald-400 hover:text-emerald-300">Esqueceu a senha?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-11"
                        />
                    </div>
                </div>

                {/* OBRIGATÓRIO PARA O CLERK FUNCIONAR */}
                <div id="clerk-captcha" className="min-h-[1px]" />

                <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            Entrar na Plataforma <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center text-sm text-zinc-500">
                Não tem uma conta?{" "}
                <Link to="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline">
                    Criar conta gratuita
                </Link>
            </div>
        </div>
    )
}
