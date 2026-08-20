// Espejo del contrato de apps/api/src/admin y apps/api/src/auth (DTOs de salida).
// createdAt llega como string ISO por JSON, no Date.

import type { ModerationActionType, ModerationTargetType, Sector, Zone } from '@plataforma/shared';

export type AdminSession = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  admin: AdminSession;
};

export type QueueItem = {
  id: string;
  targetType: ModerationTargetType;
  title: string;
  zone: Zone | null;
  sector: Sector | null;
  createdAt: string;
};

export type ModerationAction = {
  id: string;
  action: ModerationActionType;
  targetType: ModerationTargetType;
  targetId: string;
  note: string | null;
  createdAt: string;
  admin: AdminSession;
};

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};
