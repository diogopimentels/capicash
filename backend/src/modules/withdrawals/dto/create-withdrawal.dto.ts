import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateWithdrawalDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1000) // Mínimo R$ 10,00 (1000 centavos)
    amountCents: number;
}
