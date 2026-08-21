import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { publicVisibilityWhere } from '../common/prisma/public-scope.util';
import { isHoneypotFilled } from '../common/utils/honeypot.util';
import type { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import type { CreateSupportPostDto } from './dto/create-support-post.dto';
import type { QuerySupportPostDto } from './dto/query-support-post.dto';
import { toSupportPostResponse } from './dto/support-post-response.dto';
import type { SupportPostResponseDto } from './dto/support-post-response.dto';

@Injectable()
export class SupportPostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Devuelve null cuando el honeypot se disparó: la ruta no guarda nada. */
  async create(dto: CreateSupportPostDto): Promise<SupportPostResponseDto | null> {
    if (isHoneypotFilled(dto.website)) {
      return null;
    }

    if (dto.businessId) {
      const business = await this.prisma.business.findFirst({
        where: { id: dto.businessId, ...publicVisibilityWhere() },
        select: { id: true },
      });

      if (!business) {
        throw new NotFoundException('Negocio no encontrado');
      }
    }

    const post = await this.prisma.supportPost.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        zone: dto.zone,
        sector: dto.sector,
        phone: dto.phone,
        businessId: dto.businessId,
      },
    });

    return toSupportPostResponse(post);
  }

  async findAll(query: QuerySupportPostDto): Promise<PaginatedResponseDto<SupportPostResponseDto>> {
    const limit = query.limit ?? 20;
    const expiryDays = this.config.get<number>('SUPPORT_POST_EXPIRY_DAYS', 30);
    const notExpired = new Date(Date.now() - expiryDays * 24 * 60 * 60 * 1000);

    const where: Prisma.SupportPostWhereInput = {
      ...publicVisibilityWhere(),
      createdAt: { gte: notExpired },
      ...(query.type ? { type: query.type } : {}),
      ...(query.zone ? { zone: query.zone } : {}),
    };

    const posts = await this.prisma.supportPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasNext = posts.length > limit;
    const items = hasNext ? posts.slice(0, limit) : posts;

    return {
      items: items.map(toSupportPostResponse),
      nextCursor: hasNext ? items[items.length - 1].id : null,
    };
  }
}
