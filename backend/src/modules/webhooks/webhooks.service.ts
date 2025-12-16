import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AbacateWebhookDto } from './dto/abacate-webhook.dto';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    // Inicializa Stripe com a chave secreta e versão da API
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia', // Use a versão mais recente ou a que preferir
    });
  }

  async handleAbacateWebhook(payload: AbacateWebhookDto) {
    this.logger.log(`Webhook recebido: ${payload.event} - ID: ${payload.data.id}`);

    // Só nos interessa evento de pagamento aprovado
    if (payload.event !== 'billing.paid') {
      return { received: true, ignored: true };
    }

    const billingId = payload.data.id;
    return this.processPaymentSuccess(billingId);
  }

  async handleStripeWebhook(signature: string, rawBody: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      this.logger.error(`Webhook Signature Error: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`✅ Stripe Event Received: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      // O ID da sessão da Stripe (cs_test_...) é o nosso gatewayId
      return this.processPaymentSuccess(session.id);
    }

    return { received: true };
  }

  // Lógica comum de processamento de sucesso (Abacate ou Stripe)
  private async processPaymentSuccess(gatewayId: string) {
    // 1. Buscar a sessão de checkout correspondente
    const session = await this.prisma.checkoutSession.findFirst({
      where: { gatewayId: gatewayId },
      include: { product: true },
    });

    if (!session) {
      this.logger.error(`Sessão não encontrada para o Gateway ID: ${gatewayId}`);
      // Não lançar erro 404 para o webhook não ficar retentando eternamente se for um ID desconhecido
      return { received: true, notFound: true };
    }

    // Idempotência
    if (session.status === 'PAID') {
      this.logger.warn(`Sessão ${session.id} já foi processada anteriormente.`);
      return { received: true, alreadyProcessed: true };
    }

    // Transação
    await this.prisma.$transaction(async (tx) => {
      // 2. Atualizar status da sessão
      await tx.checkoutSession.update({
        where: { id: session.id },
        data: { status: 'PAID' },
      });

      // 3. Criar registro financeiro
      await tx.transaction.create({
        data: {
          amountCents: session.amountCents ?? 0,
          feeCents: 0,
          netCents: session.amountCents ?? 0,
          sellerId: session.product.userId,
          sessionId: session.id,
          productId: session.product.id,
        },
      });

      // 4. Atualizar o saldo do Vendedor
      const currentBalance = await tx.balance.findUnique({
        where: { userId: session.product.userId },
      });

      if (currentBalance) {
        await tx.balance.update({
          where: { userId: session.product.userId },
          data: { availableCents: { increment: session.amountCents } },
        });
      } else {
        await tx.balance.create({
          data: {
            userId: session.product.userId,
            availableCents: session.amountCents,
          },
        });
      }
    });

    this.logger.log(`💰 Pagamento processado com sucesso para Sessão: ${session.id} via ${gatewayId.startsWith('cs_') ? 'Stripe' : 'Abacate'}`);
    return { received: true, processed: true };
  }
}