import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async syncUser(data: { id: string; email: string; name?: string; avatarUrl?: string }) {
        console.log("🔄 [FLOW: APP_ACCESS] Service Syncing User:", JSON.stringify(data, null, 2));
        const result = await this.prisma.user.upsert({
            where: { id: data.id },
            update: {
                email: data.email,
                name: data.name,
                avatarUrl: data.avatarUrl,
            },
            create: {
                id: data.id,
                email: data.email,
                name: data.name,
                avatarUrl: data.avatarUrl,
            },
        });

        console.log("💾 [FLOW: APP_ACCESS] User Persisted in DB:", JSON.stringify({
            userId: data.id,
            email: data.email,
            action: "UPSERT",
            timestamp: new Date().toISOString()
        }, null, 2));

        return result;
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async updatePixKey(userId: string, pixKey: string, pixKeyType: string) {
        // Validações básicas por tipo de chave
        const cleanKey = pixKey.replace(/\D/g, ''); // Remove não-numéricos

        if (pixKeyType === 'CPF' && cleanKey.length !== 11) {
            throw new Error('CPF deve ter 11 dígitos');
        }

        if (pixKeyType === 'PHONE' && cleanKey.length < 10) {
            throw new Error('Telefone inválido');
        }

        if (pixKeyType === 'EMAIL' && !pixKey.includes('@')) {
            throw new Error('Email inválido');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                pixKey: pixKeyType === 'CPF' || pixKeyType === 'PHONE' ? cleanKey : pixKey,
                pixKeyType,
            },
        });
    }
}
