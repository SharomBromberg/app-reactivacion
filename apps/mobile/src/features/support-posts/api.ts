import type { Sector, SupportPostType, Zone } from '@plataforma/shared';
import { api } from '@/lib/api';
import type { Paginated, SupportPost } from '@/lib/types';

export type SupportPostsQueryParams = {
  type?: SupportPostType | null;
  zone?: Zone | null;
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

export function fetchSupportPosts(params: SupportPostsQueryParams): Promise<Paginated<SupportPost>> {
  return api.get<Paginated<SupportPost>>(`/support-posts${buildQueryString(params)}`);
}

export type CreateSupportPostPayload = {
  type: SupportPostType;
  title: string;
  description: string;
  zone: Zone;
  sector?: Sector;
  /** En formato E.164 colombiano (+57...); convertir con toPhoneE164Co antes de llamar. */
  phone: string;
  businessId?: string;
  /** Honeypot anti-spam: siempre vacío en envíos reales. */
  website?: string;
};

export function createSupportPost(payload: CreateSupportPostPayload): Promise<unknown> {
  return api.post('/support-posts', payload);
}
