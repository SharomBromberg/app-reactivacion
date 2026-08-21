import { ModerationTargetType } from '@plataforma/shared';
import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth/tokenStorage';
import type {
  AdminBusinessItem,
  AdminSupportPostItem,
  LoginResponse,
  ModerationAction,
  Paginated,
  QueueItem,
} from './types';

async function authHeaders(): Promise<Record<string, string>> {
  const session = await loadSession();
  return session ? { Authorization: `Bearer ${session.accessToken}` } : {};
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', { email, password });
}

export async function fetchQueue(): Promise<QueueItem[]> {
  return api.get<QueueItem[]>('/admin/queue', { headers: await authHeaders() });
}

export type FetchActionsParams = {
  cursor?: string;
  limit?: number;
};

export async function fetchActions(params: FetchActionsParams): Promise<Paginated<ModerationAction>> {
  const search = new URLSearchParams();
  if (params.cursor) search.set('cursor', params.cursor);
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();

  return api.get<Paginated<ModerationAction>>(`/admin/actions${qs ? `?${qs}` : ''}`, {
    headers: await authHeaders(),
  });
}

const resourceSegment: Record<ModerationTargetType, string> = {
  [ModerationTargetType.BUSINESS]: 'businesses',
  [ModerationTargetType.PRODUCT]: 'products',
  [ModerationTargetType.SUPPORT_POST]: 'support-posts',
};

export async function hideContent(targetType: ModerationTargetType, id: string): Promise<unknown> {
  return api.patch(`/admin/${resourceSegment[targetType]}/${id}/hide`, undefined, {
    headers: await authHeaders(),
  });
}

export async function restoreContent(targetType: ModerationTargetType, id: string): Promise<unknown> {
  return api.patch(`/admin/${resourceSegment[targetType]}/${id}/restore`, undefined, {
    headers: await authHeaders(),
  });
}

export async function banContent(targetType: ModerationTargetType, id: string, note: string): Promise<unknown> {
  return api.patch(`/admin/${resourceSegment[targetType]}/${id}/ban`, { note }, { headers: await authHeaders() });
}

export type FetchAdminContentParams = {
  search?: string;
  cursor?: string;
  limit?: number;
};

function buildAdminContentQuery(params: FetchAdminContentParams): string {
  const search = new URLSearchParams();
  if (params.search) search.set('search', params.search);
  if (params.cursor) search.set('cursor', params.cursor);
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchAdminBusinesses(params: FetchAdminContentParams): Promise<Paginated<AdminBusinessItem>> {
  return api.get<Paginated<AdminBusinessItem>>(`/admin/businesses${buildAdminContentQuery(params)}`, {
    headers: await authHeaders(),
  });
}

export async function fetchAdminSupportPosts(
  params: FetchAdminContentParams,
): Promise<Paginated<AdminSupportPostItem>> {
  return api.get<Paginated<AdminSupportPostItem>>(`/admin/support-posts${buildAdminContentQuery(params)}`, {
    headers: await authHeaders(),
  });
}
