import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class SalesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(userId: string) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                sellerId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                product: {
                    select: {
                        title: true,
                        imageUrl: true,
                    },
                },
                session: {
                    select: {
                        buyerEmail: true,
                    },
                },
            },
        });

        return transactions.map((t) => ({
            id: t.id,
            customer: 'Cliente', // Nome do cliente não está sendo salvo ainda, ajustar depois
            email: t.session?.buyerEmail || 'email@oculto.com',
            product: t.product?.title || 'Produto Indisponível',
            productImage: t.product?.imageUrl,
            amount: t.amountCents, // Retornando em centavos
            status: t.status.toLowerCase(),
            date: t.createdAt.toISOString(),
        }));
    }
}
