import type { Sector, SupportPost, SupportPostType, Zone } from '@prisma/client';

/** DTO de salida pública: nunca expone moderationNote ni otros campos internos. */
export interface SupportPostResponseDto {
  id: string;
  type: SupportPostType;
  title: string;
  description: string;
  zone: Zone;
  sector: Sector | null;
  phone: string;
  businessId: string | null;
  createdAt: Date;
}

export function toSupportPostResponse(post: SupportPost): SupportPostResponseDto {
  return {
    id: post.id,
    type: post.type,
    title: post.title,
    description: post.description,
    zone: post.zone,
    sector: post.sector,
    phone: post.phone,
    businessId: post.businessId,
    createdAt: post.createdAt,
  };
}
