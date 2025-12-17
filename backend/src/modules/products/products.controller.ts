import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Options, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomClerkAuthGuard } from '../../auth/custom-clerk-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('products')
@UseGuards(CustomClerkAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // Força o NestJS a reconhecer a rota OPTIONS e responder OK
    @Options()
    optionsHandler(@Res() res: Response) {
        // Define os headers permissivos manualmente
        res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');

        // Responde 204 No Content
        return res.status(204).end();
    }

    @Public()
    @Get('public/:idOrSlug')
    findPublic(@Param('idOrSlug') idOrSlug: string) {
        return this.productsService.findPublic(idOrSlug);
    }

    @Post()
    create(@Request() req, @Body() createProductDto: CreateProductDto) {
        return this.productsService.create(req.user.id, createProductDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.productsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.productsService.findOne(req.user.id, id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(req.user.id, id, updateProductDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.productsService.remove(req.user.id, id);
    }
}
