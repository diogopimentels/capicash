import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomClerkAuthGuard } from '../../auth/custom-clerk-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('products')
@UseGuards(CustomClerkAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

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
