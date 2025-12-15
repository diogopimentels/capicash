import { useUser } from "@clerk/clerk-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock } from "lucide-react"
import { CapicashLoader } from "@/components/shared/CapicashLoader"

export default function SettingsPage() {
    const { user } = useUser()

    if (!user) {
        return <div className="flex h-[50vh] items-center justify-center"><CapicashLoader /></div>
    }

    return (
        <div className="container py-10 max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Configurações</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Gerencie seus dados pessoais e preferências.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
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
                                    <AvatarImage src={user.imageUrl} />
                                    <AvatarFallback>{user.firstName?.[0] || user.emailAddresses[0].emailAddress[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" disabled>Gerenciar no Clerk</Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" value={user.fullName || ''} disabled className="bg-zinc-100 dark:bg-zinc-800 opacity-70 cursor-not-allowed" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        id="email"
                                        value={user.emailAddresses[0].emailAddress}
                                        disabled
                                        className="pl-10 bg-zinc-100 dark:bg-zinc-800 opacity-70 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500">O email e nome são gerenciados pelo Clerk.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Removida tab Financeiro - agora está em /finance */}

                {/* --- TAB SEGURANÇA --- */}
                <TabsContent value="security" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Senha</CardTitle>
                            <CardDescription>Gerencie sua senha através do Clerk.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Senha Atual</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Nova Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>
                            <Button variant="destructive" disabled>Gerenciar no Clerk</Button>
                            <p className="text-xs text-zinc-500">Use o painel do Clerk para alterar sua senha.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
