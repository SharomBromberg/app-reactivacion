import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { publicVisibilityWhere } from '../common/prisma/public-scope.util';
import { isHoneypotFilled } from '../common/utils/honeypot.util';
import type { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import type { CreateProductDto } from './dto/create-product.dto';
import type { QueryProductDto } from './dto/query-product.dto';
import { toProductResponse } from './dto/product-response.dto';
import type { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Devuelve null cuando el honeypot se disparó: la ruta no guarda nada. */
  async create(dto: CreateProductDto): Promise<ProductResponseDto | null> {
    if (isHoneypotFilled(dto.website)) {
      return null;
    }

    const business = await this.prisma.business.findFirst({
      where: { id: dto.businessId, ...publicVisibilityWhere() },
      select: { id: true },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    const product = await this.prisma.product.create({
      data: {
        businessId: dto.businessId,
        name: dto.name,
        description: dto.description,
      },
    });

    return toProductResponse(product);
  }

  async findAll(query: QueryProductDto): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const limit = query.limit ?? 20;

    const products = await this.prisma.product.findMany({
      where: {
        businessId: query.businessId,
        ...publicVisibilityWhere(),
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasNext = products.length > limit;
    const items = hasNext ? products.slice(0, limit) : products;

    return {
      items: items.map(toProductResponse),
      nextCursor: hasNext ? items[items.length - 1].id : null,
    };
  }
}
