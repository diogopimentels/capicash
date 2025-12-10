import { useState } from "react"
import { useSignUp, useClerk } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Register() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const { signOut } = useClerk()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            const signUpAttempt = await signUp.create({
                emailAddress: email,
                password,
                firstName: name,
            })

            await signUpAttempt.prepareEmailAddressVerification({ strategy: "email_code" })
            setPendingVerification(true)
            toast.success("Verifique seu email para continuar.")
        } catch (err: any) {
            console.error("Register error", JSON.stringify(err, null, 2))
            const errorData = err.errors?.[0]
            const code = errorData?.code || ""
            const msg = errorData?.message || ""

            if (code === "session_exists") {
                await signOut()
                toast.info("Sessão anterior encerrada. Por favor, tente novamente.")
                return
            }

            if (code === "client_state_invalid") {
                setError("Erro de estado. Recarregando a página...")
                setTimeout(() => window.location.reload(), 2000)
                return
            }

            if (code === "form_password_pwned") {
                setError("⚠️ O Clerk bloqueou esta senha (Regra de Segurança). Desative 'Password Protection' no Dashboard do Clerk ou use uma senha mais forte.")
            } else if (code === "form_identifier_exists") {
                setError("Este email já está cadastrado. Tente fazer login.")
            } else if (msg.toLowerCase().includes("password")) {
                setError("Senha inválida. Use pelo menos 8 caracteres.")
            } else if (msg.toLowerCase().includes("captcha")) {
                setError("Erro de verificação. Recarregue a página e tente novamente.")
            } else if (msg.includes("identifier")) {
                setError("Email inválido ou já em uso.")
            } else {
                setError(msg || "Ocorreu um erro desconhecido.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        setIsLoading(true)
        setError("")

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId })

                // Confetti Effect
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })

                navigate("/dashboard")
            } else {
                console.log(completeSignUp)
                setError("Verificação incompleta. Tente novamente.")
            }
        } catch (err: any) {
            console.error("Verification error", err)
            setError(err.errors?.[0]?.message || "Código inválido.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    {pendingVerification ? "Verifique seu email" : "Crie sua conta"}
                </h1>
                <p className="text-zinc-400">
                    {pendingVerification ? `Digite o código enviado para ${email}` : "Comece a vender seus produtos digitais hoje"}
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!pendingVerification ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-300">Nome Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Seu Nome"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-11"
                            />
                        </div>
                    </div>
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
                        <Label htmlFor="password" className="text-zinc-300">Senha</Label>
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
                                Criar Conta Grátis <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerification} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-zinc-300">Código de Verificação</Label>
                        <Input
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 text-center text-2xl tracking-widest h-14"
                            placeholder="000000"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            "Verificar Email"
                        )}
                    </Button>
                </form>
            )}

            {!pendingVerification && (
                <div className="text-center text-sm text-zinc-500">
                    Já tem uma conta?{" "}
                    <Link to="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline">
                        Fazer login
                    </Link>
                </div>
            )}
        </div>
    )
}
