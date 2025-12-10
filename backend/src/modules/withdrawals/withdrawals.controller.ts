import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('withdrawals')
@UseGuards(ClerkAuthGuard)
export class WithdrawalsController {
    constructor(private readonly withdrawalsService: WithdrawalsService) { }

    @Post('request')
    async requestWithdrawal(@Request() req, @Body() dto: CreateWithdrawalDto) {
        return this.withdrawalsService.requestWithdrawal(req.user.id, dto);
    }

    @Get('history')
    async getHistory(@Request() req) {
        return this.withdrawalsService.getHistory(req.user.id);
    }

    @Delete(':id/cancel')
    async cancelWithdrawal(@Request() req, @Param('id') id: string) {
        return this.withdrawalsService.cancelWithdrawal(req.user.id, id);
    }
}
