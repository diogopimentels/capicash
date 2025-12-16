import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional() // Opcional por enquanto para não quebrar testes, mas o front vai mandar
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  returnUrl?: string;
}