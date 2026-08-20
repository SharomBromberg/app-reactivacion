// Espejo del contrato público de apps/api (DTOs de salida). Mantener en sync manualmente
// con apps/api/src/{businesses,products,support-posts}/dto/*-response.dto.ts.
// Son las formas que llegan por JSON (createdAt como string ISO, no Date).

import type { DamageLevel, Sector, SupportPostType, Zone } from '@plataforma/shared';

export type Business = {
  id: string;
  name: string;
  zone: Zone;
  sector: Sector;
  damageLevel: DamageLevel;
  phone: string;
  description: string | null;
  createdAt: string;
};

export type BusinessDetail = Business & {
  products: Product[];
};

export type Product = {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  createdAt: string;
};

export type SupportPost = {
  id: string;
  type: SupportPostType;
  title: string;
  description: string;
  zone: Zone;
  sector: Sector | null;
  phone: string;
  businessId: string | null;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};
