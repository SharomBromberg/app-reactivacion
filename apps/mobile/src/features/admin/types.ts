// Espejo del contrato de apps/api/src/admin y apps/api/src/auth (DTOs de salida).
// createdAt llega como string ISO por JSON, no Date.

import type {
  DamageLevel,
  ModerationActionType,
  ModerationStatus,
  ModerationTargetType,
  Sector,
  SupportPostType,
  Zone,
} from '@plataforma/shared';

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

/** A diferencia de QueueItem (solo PENDIENTE), incluye status/deletedAt/bannedAt: viene de /admin/businesses. */
export type AdminBusinessItem = {
  id: string;
  name: string;
  zone: Zone;
  sector: Sector;
  damageLevel: DamageLevel;
  phone: string;
  status: ModerationStatus;
  deletedAt: string | null;
  bannedAt: string | null;
  createdAt: string;
};

/** Viene de /admin/support-posts. */
export type AdminSupportPostItem = {
  id: string;
  type: SupportPostType;
  title: string;
  zone: Zone;
  sector: Sector | null;
  status: ModerationStatus;
  deletedAt: string | null;
  bannedAt: string | null;
  createdAt: string;
};
