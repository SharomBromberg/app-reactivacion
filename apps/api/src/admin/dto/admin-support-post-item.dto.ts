import type { ModerationStatus, Sector, SupportPost, SupportPostType, Zone } from '@prisma/client';

/** A diferencia de SupportPostResponseDto (público), sí expone status/deletedAt/bannedAt: es admin-only. */
export interface AdminSupportPostItemDto {
  id: string;
  type: SupportPostType;
  title: string;
  zone: Zone;
  sector: Sector | null;
  status: ModerationStatus;
  deletedAt: Date | null;
  bannedAt: Date | null;
  createdAt: Date;
}

export function toAdminSupportPostItem(post: SupportPost): AdminSupportPostItemDto {
  return {
    id: post.id,
    type: post.type,
    title: post.title,
    zone: post.zone,
    sector: post.sector,
    status: post.status,
    deletedAt: post.deletedAt,
    bannedAt: post.bannedAt,
    createdAt: post.createdAt,
  };
}
