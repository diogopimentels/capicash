import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalHistoryDto, WithdrawalResponseDto } from './dto/withdrawal-response.dto';

@Injectable()
export class WithdrawalsService {
    private readonly logger = new Logger(WithdrawalsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async requestWithdrawal(userId: string, dto: CreateWithdrawalDto): Promise<WithdrawalResponseDto> {
        // 1. Validar se o usuário tem chave PIX configurada
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { pixKey: true, pixKeyType: true },
        });

        if (!user || !user.pixKey) {
            throw new BadRequestException(
                'Você precisa configurar uma chave PIX antes de solicitar um saque.'
            );
        }

        // 2. Verificar saldo disponível
        const balance = await this.prisma.balance.findUnique({
            where: { userId },
        });

        if (!balance || balance.availableCents < dto.amountCents) {
            throw new BadRequestException(
                `Saldo insuficiente. Disponível: R$ ${((balance?.availableCents || 0) / 100).toFixed(2)}`
            );
        }

        // 3. Criar solicitação de saque e atualizar saldo numa transação
        const withdrawal = await this.prisma.$transaction(async (tx) => {
            // Criar registro de saque
            const newWithdrawal = await tx.withdrawals.create({
                data: {
                    userId,
                    amountCents: dto.amountCents,
                    pixKey: user.pixKey!, // Safe - validated above at line 19
                    status: 'REQUESTED',
                },
            });

            // Debitar do saldo disponível
            await tx.balance.update({
                where: { userId },
                data: {
                    availableCents: { decrement: dto.amountCents },
                },
            });

            return newWithdrawal;
        });

        this.logger.log(`Saque solicitado: ${withdrawal.id} - R$ ${dto.amountCents / 100} para ${user.pixKey}`);

        // TODO: Aqui você integraria com o gateway de transferência PIX (Abacate Pay ou outro)
        // Por enquanto, vamos deixar como REQUESTED e processar manualmente ou via webhook

        return this.mapToResponseDto(withdrawal);
    }

    async getHistory(userId: string): Promise<WithdrawalHistoryDto> {
        const withdrawals = await this.prisma.withdrawals.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        // Calcular total sacado (apenas PAID)
        const totalWithdrawn = withdrawals
            .filter((w) => w.status === 'PAID')
            .reduce((sum, w) => sum + w.amountCents, 0);

        // Calcular total pendente (REQUESTED + PROCESSING)
        const pendingAmount = withdrawals
            .filter((w) => w.status === 'REQUESTED' || w.status === 'PROCESSING')
            .reduce((sum, w) => sum + w.amountCents, 0);

        return {
            withdrawals: withdrawals.map(this.mapToResponseDto),
            totalWithdrawn,
            pendingAmount,
        };
    }

    async cancelWithdrawal(userId: string, withdrawalId: string): Promise<WithdrawalResponseDto> {
        // Buscar o saque
        const withdrawal = await this.prisma.withdrawals.findFirst({
            where: { id: withdrawalId, userId },
        });

        if (!withdrawal) {
            throw new NotFoundException('Saque não encontrado.');
        }

        // Só pode cancelar se estiver REQUESTED
        if (withdrawal.status !== 'REQUESTED') {
            throw new BadRequestException(
                `Não é possível cancelar um saque com status: ${withdrawal.status}`
            );
        }

        // Cancelar e devolver saldo
        const updated = await this.prisma.$transaction(async (tx) => {
            // Atualizar status para FAILED (usamos FAILED como cancelado)
            const canceledWithdrawal = await tx.withdrawals.update({
                where: { id: withdrawalId },
                data: { status: 'FAILED' },
            });

            // Devolver saldo
            await tx.balance.update({
                where: { userId },
                data: {
                    availableCents: { increment: withdrawal.amountCents },
                },
            });

            return canceledWithdrawal;
        });

        this.logger.log(`Saque cancelado: ${withdrawalId}`);

        return this.mapToResponseDto(updated);
    }

    // Helper para mapear Prisma model para DTO
    private mapToResponseDto(withdrawal: any): WithdrawalResponseDto {
        return {
            id: withdrawal.id,
            amountCents: withdrawal.amountCents,
            status: withdrawal.status,
            pixKey: withdrawal.pixKey,
            createdAt: withdrawal.createdAt,
            processedAt: withdrawal.processedAt,
        };
    }
}
