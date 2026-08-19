import type { ModerationTargetType, Sector, Zone } from '@prisma/client';

/**
 * Forma común para mostrar en la cola de moderación contenido pendiente de
 * Business, Product y SupportPost sin importar de qué tabla venga.
 */
export interface QueueItemResponseDto {
  id: string;
  targetType: ModerationTargetType;
  title: string;
  zone: Zone | null;
  sector: Sector | null;
  createdAt: Date;
}
