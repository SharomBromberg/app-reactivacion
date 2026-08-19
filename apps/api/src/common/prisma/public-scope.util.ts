import { ModerationStatus } from '@prisma/client';

/**
 * Estados de moderación visibles en rutas públicas. Decisión ya tomada en el
 * schema (Business/Product/SupportPost.status @default(APROBADO)):
 * moderación reactiva — el contenido se ve de inmediato al crearse para no
 * frenar la adopción durante la contingencia, y el equipo lo retira
 * (RECHAZADO o bannedAt) si hace falta. PENDIENTE también se muestra porque
 * un admin puede marcarlo así para revisarlo sin ocultarlo mientras tanto.
 */
export const PUBLIC_MODERATION_STATUSES: ModerationStatus[] = [
  ModerationStatus.APROBADO,
  ModerationStatus.PENDIENTE,
];

/**
 * Filtro reutilizable para excluir SIEMPRE lo eliminado/baneado de las rutas
 * públicas. Se spreadea dentro del `where` de Business, Product y
 * SupportPost (comparten los mismos tres campos de moderación).
 */
export function publicVisibilityWhere() {
  return {
    deletedAt: null,
    bannedAt: null,
    status: { in: PUBLIC_MODERATION_STATUSES },
  };
}
