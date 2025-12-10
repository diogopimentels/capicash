import { WithdrawStatus } from '@prisma/client';

export class WithdrawalResponseDto {
    id: string;
    amountCents: number;
    status: WithdrawStatus;
    pixKey: string;
    createdAt: Date;
    processedAt?: Date;
}

export class WithdrawalHistoryDto {
    withdrawals: WithdrawalResponseDto[];
    totalWithdrawn: number;
    pendingAmount: number;
}
