import { Module } from '@nestjs/common';
import { AbacateService } from './abacate.service';

@Module({
  providers: [AbacateService],
  exports: [AbacateService], // Exportamos para usar no CheckoutModule
})
export class AbacateModule {}