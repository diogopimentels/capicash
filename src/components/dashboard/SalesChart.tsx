import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { name: "Seg", total: 120 },
    { name: "Ter", total: 300 },
    { name: "Qua", total: 240 },
    { name: "Qui", total: 450 },
    { name: "Sex", total: 600 },
    { name: "Sáb", total: 850 },
    { name: "Dom", total: 1200 },
]

export function SalesChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Vendas nos últimos 7 dias</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            itemStyle={{ color: '#10B981' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#10B981" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
