import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { CheckCircle2, Loader2, Lock, Mail, Phone, FileText, Check, ShieldCheck, Zap, Image as ImageIcon, AlertCircle, User } from "lucide-react"
import { useParams } from "react-router-dom"

import { AuroraBackground } from "@/components/ui/aurora-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/shared/Logo"

// Interface do Produto (Frontend)
interface Product {
    id: string;
    title: string;
    description: string;
    priceCents: number;
    userId: string;
    user: {
        name: string;
        avatarUrl: string;
    }
}

export function CheckoutPage() {
    const { slug } = useParams()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [taxId, setTaxId] = useState("")
    const [loading, setLoading] = useState(false)
    const [redirecting, setRedirecting] = useState(false)

    // Estados de Produto
    const [product, setProduct] = useState<Product | null>(null)
    const [loadingProduct, setLoadingProduct] = useState(true)
    const [error, setError] = useState(false)

    // 1. Fetch do Produto ao carregar
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!slug) return
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/products/public/${slug}`)
                setProduct(data)
            } catch (err) {
                console.error("Erro ao buscar produto:", err)
                setError(true)
            } finally {
                setLoadingProduct(false)
            }
        }
        fetchProduct()
    }, [slug])

    const handleGeneratePix = async () => {
        if (!email || !product) return;

        // Validar Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        setLoading(true);

        try {
            // URL de retorno para onde o cliente volta após pagar
            const returnUrl = `${window.location.origin}/p/${slug}/sucesso` // ou apenas retornar para o produto

            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/checkout`, {
                productId: product.id,
                name: name,
                email: email,
                phone: phone,
                taxId: taxId,
                returnUrl: returnUrl
            });

            console.log('✅ DADOS RECEBIDOS:', response.data);

            const checkoutUrl = response.data.qrCodeUrl || response.data.url;

            if (checkoutUrl) {
                setRedirecting(true);
                // Pequeno delay para UX
                setTimeout(() => {
                    window.location.href = checkoutUrl;
                }, 1000);
            } else {
                alert("Erro: Link de pagamento não recebido.");
                setLoading(false);
            }

        } catch (error: any) {
            console.log('❌ ERRO:', error);
            alert('Erro no Backend: ' + (error.response?.data?.message || error.message));
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(price / 100)
    }

    // Loading State
    if (loadingProduct) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white gap-2">
                <Loader2 className="animate-spin text-emerald-500" /> Carregando produto...
            </div>
        )
    }

    // Error State
    if (error || !product) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white gap-4 p-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h1 className="text-xl font-bold">Produto não encontrado</h1>
                <p className="text-zinc-400">Verifique se o link está correto ou se o produto ainda está disponível.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full relative">
            <AuroraBackground className="fixed inset-0" />

            {/* --- DESKTOP LAYOUT (Split Layout) --- */}
            <div className="hidden md:flex items-center justify-center min-h-screen p-8 relative z-10">
                {/* Spotlight Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="w-full max-w-5xl bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden border border-white/[0.08] grid grid-cols-2 relative z-20">

                    {/* COLUNA 1: PRODUTO (Visual) */}
                    <div className="p-12 bg-zinc-50/50 dark:bg-black/20 flex flex-col justify-between">
                        <div className="space-y-6">
                            <Logo size="small" forceTheme="dark" />

                            <div className="aspect-video w-full bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-inner flex items-center justify-center text-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                <ImageIcon className="w-16 h-16 text-white/80" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{product.title}</h1>
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="h-8 w-8 border-2 border-white dark:border-zinc-800 shadow-sm">
                                        <AvatarImage src={product.user.avatarUrl} />
                                        <AvatarFallback>JF</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Por {product.user.name}</span>
                                    {true && <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">Verificado</Badge>}
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">{product.description}</p>
                            </div>

                            <ul className="space-y-3 pt-2">
                                {["Compra Segura", "Acesso Imediato", "Suporte Vitalício"].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/5 text-xs text-zinc-400 flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            Produto protegido por direitos autorais.
                        </div>
                    </div>

                    {/* COLUNA 2: PAGAMENTO (Ação) */}
                    <div className="p-12 bg-white/40 dark:bg-zinc-900/40 flex flex-col justify-center relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 w-full"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-emerald-500" />
                                        Finalizar Pagamento
                                    </h2>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name-desktop" className="text-sm font-medium">Seu nome completo</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="name-desktop"
                                                    type="text"
                                                    placeholder="Seu Nome"
                                                    className="pl-9 h-12 bg-white/50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email-desktop" className="text-sm font-medium">Seu melhor e-mail</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email-desktop"
                                                    type="email"
                                                    placeholder="exemplo@email.com"
                                                    className="pl-9 h-12 bg-white/50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Enviaremos o acesso do produto para este endereço.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone-desktop" className="text-sm font-medium">Seu WhatsApp / Telefone</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone-desktop"
                                                    type="tel"
                                                    placeholder="(11) 99999-9999"
                                                    className="pl-9 h-12 bg-white/50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="taxId-desktop" className="text-sm font-medium">CPF / CNPJ</Label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="taxId-desktop"
                                                    type="text"
                                                    placeholder="000.000.000-00"
                                                    className="pl-9 h-12 bg-white/50 dark:bg-black/20 border-zinc-200 dark:border-zinc-800"
                                                    value={taxId}
                                                    onChange={(e) => setTaxId(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium flex items-center gap-2 text-zinc-900 dark:text-white">
                                                    <Zap className="w-4 h-4 text-emerald-500 fill-current" /> Pix Instantâneo
                                                </span>
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">Recomendado</Badge>
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Liberação imediata do acesso após o pagamento.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-end pb-4 border-b border-zinc-200 dark:border-white/10">
                                        <span className="text-zinc-500 dark:text-zinc-400">Total a pagar:</span>
                                        <span className="text-3xl font-bold text-zinc-900 dark:text-white">{formatPrice(product.priceCents)}</span>
                                    </div>

                                    <Button
                                        className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01]"
                                        onClick={handleGeneratePix}
                                        disabled={!name || !email || !phone || !taxId || loading || redirecting}
                                    >
                                        {loading || redirecting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                        {redirecting ? "Redirecionando para pagamento seguro..." : "Pagar Agora"}
                                    </Button>

                                    <p className="text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Pagamento processado com segurança por <strong>Capicash</strong>
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* --- MOBILE LAYOUT (Thumb Zone Focus) --- */}
            <div className="md:hidden flex flex-col min-h-screen pb-24 relative z-10">

                {/* 1. Header & Capa (Passivo) */}
                <div className="relative">
                    <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
                        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-white/10">
                            <Logo size="small" showText={true} forceTheme="light" />
                        </div>
                    </div>
                    {/* Capa Full Width com Gradiente Overlay */}
                    <div className="h-64 w-full bg-gradient-to-br from-emerald-400 to-cyan-500 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-white/50" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[1]" />
                        <div className="absolute bottom-6 left-5 right-5 z-[2] text-white">
                            <Badge className="bg-emerald-500 mb-2 border-0 hover:bg-emerald-600">{formatPrice(product.priceCents)}</Badge>
                            <h1 className="text-xl font-bold leading-tight shadow-sm">{product.title}</h1>
                            <p className="text-xs text-zinc-300 mt-1 truncate">Por {product.user.name}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Formulário (Thumb Zone) */}
                <div className="flex-1 px-5 py-6 bg-white dark:bg-zinc-950 rounded-t-3xl -mt-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="mobile-email"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label htmlFor="name-mobile" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Seu nome completo</label>
                                <Input
                                    id="name-mobile"
                                    type="text"
                                    placeholder="Seu Nome"
                                    className="h-12 text-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email-mobile" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Seu e-mail para receber</label>
                                <Input
                                    id="email-mobile"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    className="h-12 text-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-2">
                                <label htmlFor="phone-mobile" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Seu WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground z-10" />
                                    <Input
                                        id="phone-mobile"
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        className="h-12 text-lg pl-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* TaxId Input */}
                            <div className="space-y-2">
                                <label htmlFor="taxId-mobile" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">CPF / CNPJ</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground z-10" />
                                    <Input
                                        id="taxId-mobile"
                                        type="text"
                                        placeholder="000.000.000-00"
                                        className="h-12 text-lg pl-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500"
                                        value={taxId}
                                        onChange={(e) => setTaxId(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Método de Pagamento */}
                            <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500 p-2 rounded-full text-white">
                                        <Zap className="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900 dark:text-white">Pix Instantâneo</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Liberação imediata</p>
                                    </div>
                                </div>
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>

                            {/* Garantias / Trust */}
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                <div className="flex items-center gap-2 text-xs text-zinc-500 whitespace-nowrap bg-zinc-100 dark:bg-zinc-900 px-3 py-2 rounded-lg">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Compra Segura
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 whitespace-nowrap bg-zinc-100 dark:bg-zinc-900 px-3 py-2 rounded-lg">
                                    <Lock className="w-4 h-4 text-emerald-500" /> Dados Criptografados
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 3. Sticky Action Bar (Sempre visível no rodapé) */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-white/5 z-50 safe-area-bottom">
                    <Button
                        className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-xl animate-pulse-slow"
                        onClick={handleGeneratePix}
                        disabled={!name || !email || !phone || !taxId || loading || redirecting}
                    >
                        {loading || redirecting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {redirecting ? "Redirecionando..." : `Pagar ${formatPrice(product.priceCents)}`}
                    </Button>
                    <p className="text-[10px] text-center text-zinc-400 mt-2">
                        Powered by <strong>Capicash</strong>
                    </p>
                </div>
            </div>
        </div>
    )
}