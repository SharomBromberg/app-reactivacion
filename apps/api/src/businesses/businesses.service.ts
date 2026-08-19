import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { publicVisibilityWhere } from '../common/prisma/public-scope.util';
import { isHoneypotFilled } from '../common/utils/honeypot.util';
import type { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { toProductResponse } from '../products/dto/product-response.dto';
import type { CreateBusinessDto } from './dto/create-business.dto';
import type { QueryBusinessDto } from './dto/query-business.dto';
import { toBusinessResponse } from './dto/business-response.dto';
import type { BusinessDetailResponseDto, BusinessResponseDto } from './dto/business-response.dto';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Devuelve null cuando el honeypot se disparó: la ruta no guarda nada. */
  async create(dto: CreateBusinessDto): Promise<BusinessResponseDto | null> {
    if (isHoneypotFilled(dto.website)) {
      return null;
    }

    const business = await this.prisma.business.create({
      data: {
        name: dto.name,
        zone: dto.zone,
        sector: dto.sector,
        damageLevel: dto.damageLevel,
        phone: dto.phone,
        description: dto.description,
      },
    });

    return toBusinessResponse(business);
  }

  async findAll(query: QueryBusinessDto): Promise<PaginatedResponseDto<BusinessResponseDto>> {
    const limit = query.limit ?? 20;

    const where: Prisma.BusinessWhereInput = {
      ...publicVisibilityWhere(),
      ...(query.zone ? { zone: query.zone } : {}),
      ...(query.sector ? { sector: query.sector } : {}),
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
    };

    const businesses = await this.prisma.business.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasNext = businesses.length > limit;
    const items = hasNext ? businesses.slice(0, limit) : businesses;

    return {
      items: items.map(toBusinessResponse),
      nextCursor: hasNext ? items[items.length - 1].id : null,
    };
  }

  async findOne(id: string): Promise<BusinessDetailResponseDto> {
    const business = await this.prisma.business.findFirst({
      where: { id, ...publicVisibilityWhere() },
      include: {
        products: {
          where: publicVisibilityWhere(),
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    return {
      ...toBusinessResponse(business),
      products: business.products.map(toProductResponse),
    };
  }
}
