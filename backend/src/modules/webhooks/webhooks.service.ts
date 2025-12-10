import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AbacateWebhookDto } from './dto/abacate-webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) { }

  async handleAbacateWebhook(payload: AbacateWebhookDto) {
    this.logger.log(`Webhook recebido: ${payload.event} - ID: ${payload.data.id}`);

    // Só nos interessa evento de pagamento aprovado
    if (payload.event !== 'billing.paid') {
      return { received: true, ignored: true };
    }

    const billingId = payload.data.id;

    // 1. Buscar a sessão de checkout correspondente
    const session = await this.prisma.checkoutSession.findFirst({
      where: { gatewayId: billingId },
      include: { product: true }, // Precisamos saber quem é o dono do produto (seller)
    });

    if (!session) {
      this.logger.error(`Sessão não encontrada para o Billing ID: ${billingId}`);
      throw new NotFoundException('Sessão de checkout não encontrada.');
    }

    // Idempotência: Se já estiver paga, não faz nada (evita duplicar saldo)
    if (session.status === 'PAID') {
      this.logger.warn(`Sessão ${session.id} já foi processada anteriormente.`);
      return { received: true, alreadyProcessed: true };
    }

    // Vamos rodar tudo numa transação do banco para garantir integridade financeira
    await this.prisma.$transaction(async (tx) => {
      // 2. Atualizar status da sessão
      await tx.checkoutSession.update({
        where: { id: session.id },
        data: { status: 'PAID' },
      });

      // 3. Criar registro financeiro (Transaction)
      // Nota: Aqui você pode descontar taxas da plataforma se quiser. 
      // Por enquanto, vou creditar 100% para o vendedor para simplificar.
      await tx.transaction.create({
        data: {
          amountCents: session.amountCents ?? 0, // Fallback de segurança, mas deve sempre existir
          feeCents: 0,
          netCents: session.amountCents ?? 0,
          sellerId: session.product.userId,
          sessionId: session.id,
          productId: session.product.id,
        },
      });

      // 4. Atualizar o saldo do Vendedor
      // O Upsert cria a carteira se o user ainda não tiver, ou atualiza se tiver.
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

    this.logger.log(`Pagamento processado com sucesso para Sessão: ${session.id}`);
    return { received: true, processed: true };
  }
}