import { Body, Controller, Get, Post, Put, Request, UseGuards, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { UsersService } from './users.service';
import { UpdatePixKeyDto } from './dto/update-pix-key.dto';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('sync')
    async sync(@Body() body: { id: string; email: string; name?: string; avatarUrl?: string }) {
        this.logger.log(`Syncing user: ${body.email} (${body.id})`);
        return this.usersService.syncUser(body);
    }

    @Put('me/pix-key')
    async updatePixKey(@Request() req, @Body() dto: UpdatePixKeyDto) {
        return this.usersService.updatePixKey(req.user.id, dto.pixKey, dto.pixKeyType);
    }

    @Get('me/metrics')
    async getMetrics(@Request() req) {
        const userId = req.user.id;
        // console.log('Fetching metrics for user:', userId);

        // 1. Busca Saldo
        const balance = await this.prisma.balance.findUnique({
            where: { userId },
        });

        // 2. Busca totais de vendas
        const totalRevenue = await this.prisma.transaction.aggregate({
            where: { sellerId: userId, status: 'CONFIRMED' },
            _sum: { netCents: true },
        });

        // 3. Busca total de produtos
        const activeLinks = await this.prisma.product.count({
            where: { userId, active: true },
        });

        // 4. Busca vendas dos últimos 7 dias para o gráfico
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesChartData = await this.prisma.transaction.findMany({
            where: {
                sellerId: userId,
                status: 'CONFIRMED',
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
            select: {
                createdAt: true,
                netCents: true,
            },
        });

        // Agrupa por dia
        const chartMap = new Map<string, number>();
        // Inicializa os últimos 7 dias com 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
            // Capitalize first letter
            const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');
            chartMap.set(formattedDay, 0);
        }

        // Preenche com os dados reais
        salesChartData.forEach(sale => {
            const dayName = sale.createdAt.toLocaleDateString('pt-BR', { weekday: 'short' });
            const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');

            // Se o dia estiver no map (pode ser que o timezone cause edge cases, mas simplificando)
            if (chartMap.has(formattedDay)) {
                chartMap.set(formattedDay, (chartMap.get(formattedDay) || 0) + (sale.netCents / 100));
            }
        });

        const salesChart = Array.from(chartMap.entries()).map(([name, total]) => ({ name, total }));

        // 5. Busca vendas recentes (últimas 5)
        const recentSalesRaw = await this.prisma.transaction.findMany({
            where: {
                sellerId: userId,
                status: 'CONFIRMED',
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
            include: {
                product: {
                    select: {
                        title: true
                    }
                },
                session: {
                    select: {
                        buyerEmail: true
                    }
                }
            }
        });

        const recentSales = recentSalesRaw.map(sale => ({
            id: sale.id,
            customerName: 'Cliente', // Nome não salvo no checkout ainda
            customerEmail: sale.session?.buyerEmail || 'email@oculto.com',
            amount: sale.netCents / 100,
            productName: sale.product?.title || 'Produto',
            avatar: `https://avatar.vercel.sh/${sale.session?.buyerEmail || 'default'}.png`
        }));

        return {
            availableBalance: balance?.availableCents || 0,
            totalRevenue: totalRevenue._sum.netCents || 0,
            activeLinks: activeLinks || 0,
            salesCount: 0,
            salesChart,
            recentSales
        };
    }
}
