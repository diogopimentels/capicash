import { PartialType } from '@nestjs/mapped-types'; // NestJS mapped-types might not be installed, checking package.json later. 
// Actually, let's use the standard way or install mapped-types. 
// Standard way without mapped-types for now to avoid extra install if not needed, but PartialType is very useful.
// Let's assume I can use class-validator decorators again or just install mapped-types.
// I'll check package.json first or just write it explicitly.
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(100)
    priceCents?: number;

    @IsOptional()
    @IsUrl()
    redirectUrl?: string;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
