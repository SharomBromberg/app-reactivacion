import { DamageLevel, ModerationActionType, ModerationTargetType, Sector, SupportPostType, Zone } from '@plataforma/shared';

export const zoneLabels: Record<Zone, string> = {
  [Zone.ATARDECERES]: 'Atardeceres',
  [Zone.CIUDADELA_DEL_NORTE]: 'Ciudadela del Norte',
  [Zone.CUMANDAY]: 'Cumanday',
  [Zone.ECOTURISTICO_CERRO_DE_ORO]: 'Ecoturístico Cerro de Oro',
  [Zone.ESTACION]: 'Estación',
  [Zone.LA_FUENTE]: 'La Fuente',
  [Zone.LA_MACARENA]: 'La Macarena',
  [Zone.PALOGRANDE]: 'Palogrande',
  [Zone.SAN_JOSE]: 'San José',
  [Zone.TESORITO]: 'Tesorito',
  [Zone.UNIVERSITARIA]: 'Universitaria',
  [Zone.OTRA]: 'Otra',
};

export const sectorLabels: Record<Sector, string> = {
  [Sector.ALIMENTOS_Y_BEBIDAS]: 'Alimentos y bebidas',
  [Sector.ABARROTES_Y_TIENDA]: 'Abarrotes y tienda',
  [Sector.ROPA_Y_CALZADO]: 'Ropa y calzado',
  [Sector.BELLEZA_Y_CUIDADO_PERSONAL]: 'Belleza y cuidado personal',
  [Sector.SALUD]: 'Salud',
  [Sector.EDUCACION]: 'Educación',
  [Sector.TECNOLOGIA]: 'Tecnología',
  [Sector.CONSTRUCCION_Y_FERRETERIA]: 'Construcción y ferretería',
  [Sector.TRANSPORTE]: 'Transporte',
  [Sector.SERVICIOS_PROFESIONALES]: 'Servicios profesionales',
  [Sector.ARTE_Y_ARTESANIAS]: 'Arte y artesanías',
  [Sector.AGROPECUARIO]: 'Agropecuario',
  [Sector.OTRO]: 'Otro',
};

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

export const moderationActionTypeLabels: Record<ModerationActionType, string> = {
  [ModerationActionType.APPROVE]: 'Aprobado',
  [ModerationActionType.REJECT]: 'Rechazado',
  [ModerationActionType.BAN]: 'Baneado',
  [ModerationActionType.UNBAN]: 'Desbaneado',
  [ModerationActionType.SOFT_DELETE]: 'Ocultado',
  [ModerationActionType.RESTORE]: 'Restaurado',
  [ModerationActionType.EDIT_NOTE]: 'Nota editada',
};
