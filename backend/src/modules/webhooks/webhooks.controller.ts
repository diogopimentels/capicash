import { Body, Controller, Post, HttpCode, HttpStatus, Headers, UnauthorizedException } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { AbacateWebhookDto } from './dto/abacate-webhook.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { createHmac } from 'crypto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) { }

  @Public() // <--- OBRIGATÓRIO: Libera acesso sem login
  @Post('abacate')
  @HttpCode(HttpStatus.OK) // Retornar 200 é boa prática para webhooks (senão o gateway tenta reenviar)
  async handleAbacate(
    @Body() payload: AbacateWebhookDto,
    @Headers('x-webhook-signature') signature?: string,
  ) {
    console.log('🪝 WEBHOOK RECEIVED (RAW):', JSON.stringify(payload, null, 2));

    // Validar assinatura HMAC (se configurada)
    if (process.env.ABACATE_WEBHOOK_SECRET) {
      if (!signature) {
        throw new UnauthorizedException('Webhook signature missing');
      }

      const expectedSignature = createHmac('sha256', process.env.ABACATE_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new UnauthorizedException('Invalid webhook signature');
      }
    }

    return this.webhooksService.handleAbacateWebhook(payload);
  }
}