import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Public() // Libera para compradores sem login criarem o Pix
  @Post()
  async create(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.checkoutService.createSession(createCheckoutDto);
  }

  @Public() // Libera para o Frontend consultar o status sem login
  @Get(':id')
  async getStatus(@Param('id') id: string) {
    return this.checkoutService.getSessionStatus(id);
  }
}