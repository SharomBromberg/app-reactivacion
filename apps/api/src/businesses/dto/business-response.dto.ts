import type { Business, DamageLevel, Sector, Zone } from '@prisma/client';
import type { ProductResponseDto } from '../../products/dto/product-response.dto';

/** DTO de salida pública: nunca expone moderationNote ni otros campos internos. */
export interface BusinessResponseDto {
  id: string;
  name: string;
  zone: Zone;
  sector: Sector;
  damageLevel: DamageLevel;
  phone: string;
  description: string | null;
  createdAt: Date;
}

export interface BusinessDetailResponseDto extends BusinessResponseDto {
  products: ProductResponseDto[];
}

export function toBusinessResponse(business: Business): BusinessResponseDto {
  return {
    id: business.id,
    name: business.name,
    zone: business.zone,
    sector: business.sector,
    damageLevel: business.damageLevel,
    phone: business.phone,
    description: business.description,
    createdAt: business.createdAt,
  };
}
