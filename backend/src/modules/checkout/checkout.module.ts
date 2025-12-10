import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { AbacateModule } from '../abacate/abacate.module';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [AbacateModule, PrismaModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}