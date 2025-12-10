import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(100) // Mínimo 1 real (100 centavos)
    priceCents: number;

    @IsNotEmpty()
    @IsUrl()
    redirectUrl: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}
