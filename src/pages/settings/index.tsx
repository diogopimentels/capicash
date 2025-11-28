import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock } from "lucide-react"

export default function SettingsPage() {
    // Mock Data
    const user = {
        name: "Admin User",
        email: "admin@libera.ai", // READ ONLY
        avatar: "https://github.com/shadcn.png"
    }

    return (
        <div className="container py-10 max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Configurações</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Gerencie seus dados pessoais e preferências.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="finance">Financeiro</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                </TabsList>

                {/* --- TAB PERFIL --- */}
                <TabsContent value="profile" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados Pessoais</CardTitle>
                            <CardDescription>Atualize sua foto e nome de exibição.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-900 shadow-xl">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">Alterar Foto</Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" defaultValue={user.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input id="email" defaultValue={user.email} disabled className="pl-10 bg-zinc-100 dark:bg-zinc-800 opacity-70 cursor-not-allowed" />
                                </div>
                                <p className="text-xs text-zinc-500">O email não pode ser alterado.</p>
                            </div>

                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Salvar Alterações</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB FINANCEIRO (PIX) --- */}
                <TabsContent value="finance" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Chave Pix</CardTitle>
                            <CardDescription>Defina onde você receberá seus pagamentos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Tipo de Chave</Label>
                                    <Select defaultValue="cpf">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cpf">CPF/CNPJ</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="phone">Celular</SelectItem>
                                            <SelectItem value="random">Aleatória</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-3">
                                    <Label>Chave Pix</Label>
                                    <Input placeholder="Digite sua chave..." />
                                </div>
                            </div>
                            <Button className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white">Atualizar Chave Pix</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB SEGURANÇA --- */}
                <TabsContent value="security" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Senha</CardTitle>
                            <CardDescription>Altere sua senha de acesso.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Senha Atual</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input type="password" placeholder="••••••••" className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Nova Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input type="password" placeholder="••••••••" className="pl-10" />
                                </div>
                            </div>
                            <Button variant="destructive">Atualizar Senha</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
