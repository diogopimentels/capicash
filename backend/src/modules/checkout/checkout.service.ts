import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly prisma: PrismaService,
        // TODO: Add proper payment service (Stripe/Abacate) here
    ) { }

    async createSession(dto: CreateCheckoutDto) {
        try {
            // 1. Buscar o produto
            const product = await this.prisma.product.findUnique({
                where: { id: dto.productId },
            });

            if (!product) {
                throw new NotFoundException('Produto não encontrado.');
            }

            // Helper para limpar caracteres não numéricos
            const clean = (val: string | undefined) => val?.replace(/\D/g, '');

            const cleanPhone = clean(dto.phone);
            const cleanTaxId = clean(dto.taxId);

            // 2. TEMPORARILY DISABLED: Payment gateway integration needed
            // TODO: Re-enable when proper payment service is configured
            throw new Error('Payment gateway not configured. Please contact support.');

            /*
            // Original Abacate Pay integration code:
            const billing = await this.abacateService.createBilling({
                frequency: 'ONE_TIME',
                methods: ['PIX'],
                products: [
                    {
                        externalId: product.id,
                        name: product.title,
                        quantity: 1,
                        price: product.priceCents,
                    },
                ],
                returnUrl: dto.returnUrl || product.redirectUrl,
                completionUrl: dto.returnUrl || product.redirectUrl,
                customer: dto.email ? {
                    email: dto.email,
                    name: dto.name || "Cliente Visitante",
                    cellphone: cleanPhone || "11999999999",
                    taxId: cleanTaxId || "00000000000"
                } : undefined,
            });
            */

            /*
            // 3. Salvar sessão no banco (disabled until payment gateway is configured)
            const session = await this.prisma.checkoutSession.create({
                data: {
                    status: 'PENDING',
                    gatewayId: billing.id,
                    pixCode: billing.pix?.code,
                    pixQrCode: billing.pix?.qrCode,
                    amountCents: product.priceCents,
                    productId: product.id,
                },
            });

            const ret = {
                sessionId: session.id,
                qrCodeUrl: billing.url,
                amount: product.priceCents,
            };

            console.log('🚀 RETORNANDO PARA O FRONT:', ret);
            return ret;
            */
        } catch (error) {
            console.error('Erro ao criar sessão de checkout:', error);
            // Logar o erro real para debug
            if (error.response) {
                console.error('Detalhe do erro Abacate:', error.response.data);
            }
            throw error; // Repassa o erro para o Nest tratar (500)
        }
    }

    // --- NOVO MÉTODO PARA POLLING (Status Check) ---
    async getSessionStatus(sessionId: string) {
        const session = await this.prisma.checkoutSession.findUnique({
            where: { id: sessionId },
            select: { status: true, amountCents: true, productId: true }, // Só precisamos saber o status
        });

        if (!session) {
            throw new NotFoundException('Sessão não encontrada');
        }

        return session;
    }
}