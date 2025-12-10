import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class AbacateWebhookDto {
  @IsString()
  @IsNotEmpty()
  event: string; // Ex: 'billing.paid'

  @IsObject()
  data: {
    id: string; // ID da cobrança no Abacate
    status: string; // 'PAID'
    amount: number; // Valor em centavos
    metadata?: any;
    customer?: {
      email?: string;
      name?: string;
    };
  };
}