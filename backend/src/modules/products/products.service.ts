import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateProductDto) {
        // Gera um slug único simples (na vida real usaria uma lib de slugify e verificação de colisão)
        const slug = dto.title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(7);

        return this.prisma.product.create({
            data: {
                userId,
                title: dto.title,
                description: dto.description,
                priceCents: dto.priceCents,
                redirectUrl: dto.redirectUrl,
                imageUrl: dto.imageUrl,
                slug,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(userId: string, id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, userId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
        return product;
    }

    async findPublic(idOrSlug: string) {
        // Tenta achar por ID
        let product = await this.prisma.product.findUnique({
            where: { id: idOrSlug },
            include: { user: { select: { name: true, avatarUrl: true } } } // Inclui dados do seller
        });

        // Se não achou, tenta por Slug
        if (!product) {
            product = await this.prisma.product.findUnique({
                where: { slug: idOrSlug },
                include: { user: { select: { name: true, avatarUrl: true } } }
            });
        }

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        return product;
    }

    async update(userId: string, id: string, dto: UpdateProductDto) {
        // Verifica se existe antes
        await this.findOne(userId, id);

        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);

        // Soft delete (desativar) ou delete real? O requisito diz "Delete", mas em ecommerce geralmente desativamos.
        // Vamos fazer delete real por enquanto para simplificar o CRUD, ou toggle active.
        // O schema tem "active", então vamos desativar se for chamado o remove, ou deletar mesmo.
        // Vamos deletar para limpar o banco, mas cuidado com relacionamentos.
        // Como temos CheckoutSession e Transaction, delete pode falhar se tiver dados.
        // Vamos tentar delete, se falhar (por FK), o Prisma avisa.

        return this.prisma.product.delete({
            where: { id },
        });
    }
}
