import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Loader2, Key, Save, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { getWithdrawalHistory, requestWithdrawal, updatePixKey, type Withdrawal } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Finance() {
    const { user } = useUser()
    const balance = useAppStore((state) => state.balance)

    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [isSavingPix, setIsSavingPix] = useState(false)
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)

    const [pixKey, setPixKey] = useState("")
    const [pixType, setPixType] = useState<string>("CPF")
    const [withdrawAmount, setWithdrawAmount] = useState("")

    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
    const [totalWithdrawn, setTotalWithdrawn] = useState(0)
    const [pendingAmount, setPendingAmount] = useState(0)

    // Carregar histórico e dados do usuário
    useEffect(() => {
        loadWithdrawalHistory()

        // Carregar PIX key do usuário se tiver
        if (user?.unsafeMetadata?.pixKey) {
            setPixKey(user.unsafeMetadata.pixKey as string)
            setPixType((user.unsafeMetadata.pixKeyType as string) || "CPF")
        }
    }, [user])

    const loadWithdrawalHistory = async () => {
        try {
            setIsLoadingHistory(true)
            const data = await getWithdrawalHistory()
            setWithdrawals(data.withdrawals)
            setTotalWithdrawn(data.totalWithdrawn)
            setPendingAmount(data.pendingAmount)
        } catch (error: any) {
            console.error("Erro ao carregar histórico:", error)
            toast.error(error.response?.data?.message || "Erro ao carregar histórico de saques")
        } finally {
            setIsLoadingHistory(false)
        }
    }

    const handleWithdraw = async () => {
        const amountCents = Math.round(parseFloat(withdrawAmount) * 100)

        if (!amountCents || amountCents < 1000) {
            toast.error("Valor mínimo de saque: R$ 10,00")
            return
        }

        if (amountCents > balance) {
            toast.error("Saldo insuficiente")
            return
        }

        try {
            setIsWithdrawing(true)
            await requestWithdrawal(amountCents)
            toast.success("Saque solicitado com sucesso!")
            setWithdrawAmount("")
            await loadWithdrawalHistory()
        } catch (error: any) {
            console.error("Erro ao solicitar saque:", error)
            toast.error(error.response?.data?.message || "Erro ao solicitar saque")
        } finally {
            setIsWithdrawing(false)
        }
    }

    const handleSavePix = async () => {
        if (!pixKey.trim()) {
            toast.error("Digite uma chave PIX válida")
            return
        }

        try {
            setIsSavingPix(true)
            await updatePixKey(pixKey, pixType)
            toast.success("Chave PIX salva com sucesso!")
        } catch (error: any) {
            console.error("Erro ao salvar PIX:", error)
            toast.error(error.response?.data?.message || "Erro ao salvar chave PIX")
        } finally {
            setIsSavingPix(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const getStatusBadge = (status: Withdrawal['status']) => {
        const styles = {
            REQUESTED: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
            PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
        }

        const labels = {
            REQUESTED: "Solicitado",
            PROCESSING: "Processando",
            PAID: "Pago",
            FAILED: "Falhou",
        }

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Coluna 1: Saldo (1/3) */}
                <Card className="md:col-span-1 bg-emerald-600 text-white border-none shadow-xl shadow-emerald-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-100">
                            Saldo Disponível
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">R$ {(balance / 100).toFixed(2)}</div>
                        <p className="text-xs text-emerald-100/80 mt-1">
                            +R$ {(pendingAmount / 100).toFixed(2)} pendente
                        </p>

                        <div className="mt-4 space-y-2">
                            <Label className="text-emerald-100">Valor do Saque</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200/50"
                                step="0.01"
                                min="10"
                            />
                        </div>

                        <Button
                            variant="secondary"
                            className="mt-4 w-full bg-white text-emerald-600 hover:bg-emerald-50 border-none"
                            onClick={handleWithdraw}
                            disabled={isWithdrawing || balance <= 0}
                        >
                            {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Solicitar Saque
                        </Button>
                    </CardContent>
                </Card>

                {/* Coluna 2: Configuração Pix (2/3) */}
                <Card className="md:col-span-2 bg-card/50 backdrop-blur-md border-white/10">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Key className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <CardTitle>Sua Chave Pix</CardTitle>
                                <CardDescription>É por aqui que você recebe suas vendas.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!pixKey && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Você precisa configurar uma chave PIX para poder solicitar saques.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo de Chave</Label>
                                <Select value={pixType} onValueChange={setPixType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CPF">CPF/CNPJ</SelectItem>
                                        <SelectItem value="EMAIL">Email</SelectItem>
                                        <SelectItem value="PHONE">Telefone</SelectItem>
                                        <SelectItem value="RANDOM">Aleatória</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Chave Pix</Label>
                                <Input
                                    placeholder="Digite sua chave..."
                                    value={pixKey}
                                    onChange={(e) => setPixKey(e.target.value)}
                                    className="bg-background/50"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-border/50 pt-4">
                        <Button
                            onClick={handleSavePix}
                            className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={isSavingPix}
                        >
                            {isSavingPix && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Chave
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur-md border-white/10">
                <CardHeader>
                    <CardTitle>Histórico de Saques</CardTitle>
                    <CardDescription>
                        Total sacado: R$ {(totalWithdrawn / 100).toFixed(2)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : withdrawals.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum saque realizado ainda
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawals.map((withdrawal) => (
                                    <TableRow key={withdrawal.id} className="hover:bg-muted/50">
                                        <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            R$ {(withdrawal.amountCents / 100).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
