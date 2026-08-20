import type { DamageLevel, Sector, Zone } from '@plataforma/shared';
import { api } from '@/lib/api';
import type { BusinessDetail, Business, Paginated } from '@/lib/types';

export type BusinessesQueryParams = {
  zone?: Zone | null;
  sector?: Sector | null;
  search?: string;
  cursor?: string;
  limit?: number;
};

function buildQueryString(params: Record<string, string | number | null | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function fetchBusinesses(params: BusinessesQueryParams): Promise<Paginated<Business>> {
  return api.get<Paginated<Business>>(`/businesses${buildQueryString(params)}`);
}

export function fetchBusiness(id: string): Promise<BusinessDetail> {
  return api.get<BusinessDetail>(`/businesses/${id}`);
}

export type CreateBusinessPayload = {
  name: string;
  zone: Zone;
  sector: Sector;
  damageLevel: DamageLevel;
  /** En formato E.164 colombiano (+57...); convertir con toPhoneE164Co antes de llamar. */
  phone: string;
  description?: string;
  /** Honeypot anti-spam: siempre vacío en envíos reales. */
  website?: string;
};

export function createBusiness(payload: CreateBusinessPayload): Promise<unknown> {
  return api.post('/businesses', payload);
}
