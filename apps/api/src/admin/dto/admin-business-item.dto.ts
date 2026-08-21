import type { Business, DamageLevel, ModerationStatus, Sector, Zone } from '@prisma/client';

/** A diferencia de BusinessResponseDto (público), sí expone status/deletedAt/bannedAt: es admin-only. */
export interface AdminBusinessItemDto {
  id: string;
  name: string;
  zone: Zone;
  sector: Sector;
  damageLevel: DamageLevel;
  phone: string;
  status: ModerationStatus;
  deletedAt: Date | null;
  bannedAt: Date | null;
  createdAt: Date;
}

export function toAdminBusinessItem(business: Business): AdminBusinessItemDto {
  return {
    id: business.id,
    name: business.name,
    zone: business.zone,
    sector: business.sector,
    damageLevel: business.damageLevel,
    phone: business.phone,
    status: business.status,
    deletedAt: business.deletedAt,
    bannedAt: business.bannedAt,
    createdAt: business.createdAt,
  };
}
