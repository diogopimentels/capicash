import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesChartProps {
    data: { name: string; total: number }[]
}

export function SalesChart({ data }: SalesChartProps) {
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
