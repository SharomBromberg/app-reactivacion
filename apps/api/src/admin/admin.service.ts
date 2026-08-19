import { Injectable } from '@nestjs/common';
import { ModerationStatus, ModerationTargetType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import type { QueryActionsDto } from './dto/query-actions.dto';
import type { QueueItemResponseDto } from './dto/queue-item-response.dto';
import { toModerationActionResponse } from './dto/moderation-action-response.dto';
import type { ModerationActionResponseDto } from './dto/moderation-action-response.dto';

/**
 * Tope de la cola de moderación. No hay modelo de "reportes" en el MVP
 * (fuera de alcance, ver CLAUDE.md), así que la cola es todo lo PENDIENTE
 * sin eliminar/banear, más viejo primero (FIFO).
 */
const QUEUE_LIMIT = 50;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getQueue(): Promise<QueueItemResponseDto[]> {
    const pendingWhere = { status: ModerationStatus.PENDIENTE, deletedAt: null, bannedAt: null };

    const [businesses, products, supportPosts] = await Promise.all([
      this.prisma.business.findMany({
        where: pendingWhere,
        orderBy: { createdAt: 'asc' },
        take: QUEUE_LIMIT,
      }),
      this.prisma.product.findMany({
        where: pendingWhere,
        orderBy: { createdAt: 'asc' },
        take: QUEUE_LIMIT,
      }),
      this.prisma.supportPost.findMany({
        where: pendingWhere,
        orderBy: { createdAt: 'asc' },
        take: QUEUE_LIMIT,
      }),
    ]);

    const items: QueueItemResponseDto[] = [
      ...businesses.map((business) => ({
        id: business.id,
        targetType: ModerationTargetType.BUSINESS,
        title: business.name,
        zone: business.zone,
        sector: business.sector,
        createdAt: business.createdAt,
      })),
      ...products.map((product) => ({
        id: product.id,
        targetType: ModerationTargetType.PRODUCT,
        title: product.name,
        zone: null,
        sector: null,
        createdAt: product.createdAt,
      })),
      ...supportPosts.map((post) => ({
        id: post.id,
        targetType: ModerationTargetType.SUPPORT_POST,
        title: post.title,
        zone: post.zone,
        sector: post.sector,
        createdAt: post.createdAt,
      })),
    ];

    return items.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).slice(0, QUEUE_LIMIT);
  }

  async listActions(query: QueryActionsDto): Promise<PaginatedResponseDto<ModerationActionResponseDto>> {
    const limit = query.limit ?? 20;

    const actions = await this.prisma.moderationAction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      include: { admin: { select: { id: true, name: true, email: true } } },
    });

    const hasNext = actions.length > limit;
    const items = hasNext ? actions.slice(0, limit) : actions;

    return {
      items: items.map(toModerationActionResponse),
      nextCursor: hasNext ? items[items.length - 1].id : null,
    };
  }
}
