import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateCheckoutDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsEmail()
  buyerEmail?: string;
}