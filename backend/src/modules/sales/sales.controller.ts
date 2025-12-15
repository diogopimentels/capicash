import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('sales')
@UseGuards(ClerkAuthGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Get()
    async findAll(@Request() req) {
        return this.salesService.findAll(req.user.id);
    }
}
