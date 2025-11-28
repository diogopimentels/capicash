import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentSales() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://avatar.vercel.sh/${i}.png`} alt="Avatar" />
                                <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Cliente #{i}</p>
                                <p className="text-sm text-muted-foreground">
                                    cliente{i}@exemplo.com
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-primary">+R$ 199,00</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
