import { Body, Controller, Post, HttpCode, HttpStatus, Headers, UnauthorizedException, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) { }

  @Public()
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripe(@Body() body: any, @Headers('stripe-signature') signature: string, @Req() req: any) {
    if (!signature) {
      throw new UnauthorizedException('Stripe signature missing');
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new UnauthorizedException('Raw body missing for Stripe signature verification');
    }

    return this.webhooksService.handleStripeWebhook(signature, rawBody);
  }

  @Public()
  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  async handleClerk(@Body() body: any) {
    return this.webhooksService.handleClerkWebhook(body);
  }
}