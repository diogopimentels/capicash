import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum PixKeyType {
    CPF = 'CPF',
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    RANDOM = 'RANDOM',
}

export class UpdatePixKeyDto {
    @IsNotEmpty()
    @IsString()
    pixKey: string;

    @IsNotEmpty()
    @IsEnum(PixKeyType)
    pixKeyType: PixKeyType;
}
