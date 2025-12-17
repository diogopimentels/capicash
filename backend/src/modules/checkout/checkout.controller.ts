import { Controller, Post, Body, Options, HttpCode, HttpStatus } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Public } from '../../shared/decorators/public.decorator'; // Ajuste o caminho se necessário

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) { }

  @Post()
  async createCheckout(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.checkoutService.createStripeSession(
      createCheckoutDto.productId,
      // Passar o ID do usuário se estiver autenticado, ou gerenciar no service
      // Para MVP e simplificação, assumindo que o endpoint pode receber usuário ou ser público
    );
  }

  @Options()
  @HttpCode(HttpStatus.OK)
  options() {
    return;
  }
}