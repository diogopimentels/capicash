import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../shared/prisma/prisma.service'; // Ajuste o caminho conforme sua estrutura
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {
    private stripe: Stripe;

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') ?? '', {
            apiVersion: '2025-02-24.acacia', // Use a versão mais recente ou compatível
        });
    }

    async createStripeSession(productId: string, userId?: string) {
        console.log("🏗️ [FLOW: LINK_ISSUE/GATEWAY] Creating Stripe Session for:", JSON.stringify({ productId, userId }, null, 2));

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        const frontendUrl = this.configService.get<string>('FRONTEND_URL');

        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'brl',
                            product_data: {
                                name: product.title,
                                description: product.description ?? undefined,
                                // images: [product.imageUrl], // Se tiver imagem
                            },
                            unit_amount: product.priceCents, // Já está em centavos
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/checkout/cancel`,
                metadata: {
                    productId: product.id,
                    userId: userId || '',
                },
            });

            console.log("✅ [FLOW: PAYMENT_GATEWAY] Session Created:", JSON.stringify({
                url: session.url,
                id: session.id,
                timestamp: new Date().toISOString()
            }, null, 2));

            // Salvar intenção de checkout (opcional mas recomendado)
            // await this.prisma.checkoutSession.create({ ... })

            return { url: session.url };
        } catch (error) {
            console.error('Erro ao criar sessão do Stripe:', error);
            throw new InternalServerErrorException('Erro ao criar checkout');
        }
    }
}