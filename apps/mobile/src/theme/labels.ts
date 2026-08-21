import {
  DamageLevel,
  ModerationActionType,
  ModerationStatus,
  ModerationTargetType,
  SECTOR_LABELS,
  SupportPostType,
  ZONE_LABELS,
} from '@plataforma/shared';

export const zoneLabels = ZONE_LABELS;

export const sectorLabels = SECTOR_LABELS;

export const damageLevelLabels: Record<DamageLevel, string> = {
  [DamageLevel.SIN_AFECTACION]: 'Sin afectación',
  [DamageLevel.AFECTACION_LEVE]: 'Afectación leve',
  [DamageLevel.AFECTACION_MODERADA]: 'Afectación moderada',
  [DamageLevel.LOCAL_INHABITABLE]: 'Local inhabitable',
  [DamageLevel.PERDIDA_TOTAL]: 'Pérdida total',
};

export const supportPostTypeLabels: Record<SupportPostType, string> = {
  [SupportPostType.BUSCO]: 'Busco',
  [SupportPostType.OFREZCO]: 'Ofrezco',
};

export const moderationTargetTypeLabels: Record<ModerationTargetType, string> = {
  [ModerationTargetType.BUSINESS]: 'Negocio',
  [ModerationTargetType.PRODUCT]: 'Producto',
  [ModerationTargetType.SUPPORT_POST]: 'Publicación de apoyo',
};

export const moderationStatusLabels: Record<ModerationStatus, string> = {
  [ModerationStatus.PENDIENTE]: 'Pendiente',
  [ModerationStatus.APROBADO]: 'Aprobado',
  [ModerationStatus.RECHAZADO]: 'Rechazado',
};

export const moderationActionTypeLabels: Record<ModerationActionType, string> = {
  [ModerationActionType.APPROVE]: 'Aprobado',
  [ModerationActionType.REJECT]: 'Rechazado',
  [ModerationActionType.BAN]: 'Baneado',
  [ModerationActionType.UNBAN]: 'Desbaneado',
  [ModerationActionType.SOFT_DELETE]: 'Ocultado',
  [ModerationActionType.RESTORE]: 'Restaurado',
  [ModerationActionType.EDIT_NOTE]: 'Nota editada',
};
