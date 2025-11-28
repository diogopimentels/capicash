import { useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Loader2, Key, Save } from "lucide-react"
import { toast } from "sonner"

export function Finance() {
    const balance = useAppStore((state) => state.balance)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [pixKey, setPixKey] = useState("")
    const [pixType, setPixType] = useState("cpf")

    const handleWithdraw = async () => {
        if (!pixKey) {
            toast.error("Cadastre sua chave Pix para realizar saques.")
            return
        }
        setIsWithdrawing(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsWithdrawing(false)
        toast.success("Saque solicitado com sucesso! O valor cairá na sua conta em até 1 dia útil.")
    }

    const handleSavePix = () => {
        toast.success("Chave Pix salva com sucesso!")
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
                        <div className="text-4xl font-bold">R$ {balance.toFixed(2)}</div>
                        <p className="text-xs text-emerald-100/80 mt-1">
                            +R$ 0,00 pendente
                        </p>
                        <Button
                            variant="secondary"
                            className="mt-6 w-full bg-white text-emerald-600 hover:bg-emerald-50 border-none"
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
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo de Chave</Label>
                                <Select value={pixType} onValueChange={setPixType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cpf">CPF/CNPJ</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="phone">Telefone</SelectItem>
                                        <SelectItem value="random">Aleatória</SelectItem>
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
                        <Button onClick={handleSavePix} className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Chave
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur-md border-white/10">
                <CardHeader>
                    <CardTitle>Histórico de Saques</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-muted/50">
                                <TableCell>28/11/2025</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                        Pago
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-medium">R$ 1.250,00</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/50">
                                <TableCell>25/11/2025</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                        Pago
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-medium">R$ 3.400,00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
