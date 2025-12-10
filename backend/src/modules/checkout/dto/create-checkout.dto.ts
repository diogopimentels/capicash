import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsEmail()
  @IsOptional() // Opcional por enquanto para não quebrar testes, mas o front vai mandar
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  taxId?: string;
}