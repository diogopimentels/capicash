import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      this.logger.error("❌ FATAL: STRIPE_SECRET_KEY não encontrada no .env");
      // Evita o crash total se a chave não estiver lá, mas o webhook não vai funcionar
      // Se preferir o crash para alertar no deploy, descomente o throw.
      // throw new Error("STRIPE_SECRET_KEY is missing");
    }

    // Inicializa Stripe com a chave (se existir)
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2025-02-24.acacia',
      });
    }
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

  // --- CLERK WEBHOOK HANDLER ---
  async handleClerkWebhook(payload: any) {
    const eventType = payload.type;
    this.logger.log(`📨 Clerk Event Received: ${eventType}`);

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const userData = payload.data;

      // Extrai o email primário
      const primaryEmail = userData.email_addresses?.find(
        (email: any) => email.id === userData.primary_email_address_id
      )?.email_address || userData.email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        this.logger.warn(`⚠️ User ${userData.id} has no email address, skipping sync`);
        return { received: true, skipped: true };
      }

      // Sincroniza o usuário no banco usando upsert
      await this.prisma.user.upsert({
        where: { id: userData.id },
        update: {
          email: primaryEmail,
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
          avatarUrl: userData.image_url || null,
        },
        create: {
          id: userData.id,
          email: primaryEmail,
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
          avatarUrl: userData.image_url || null,
        },
      });

      this.logger.log(`✅ User ${userData.id} synced successfully`);
      return { received: true, synced: true };
    }

    // Outros eventos são apenas acknowledged
    return { received: true };
  }
}
