// Enums de dominio compartidos entre apps/api y apps/mobile.
// Deben mantenerse en sync manualmente con apps/api/prisma/schema.prisma:
// Prisma no permite importar enums desde un archivo externo, así que estos
// son la copia "para TypeScript" del mismo vocabulario.

/** Comunas urbanas de Manizales (Acuerdo 589 de 2004). Lista editable. */
export enum Zone {
  ATARDECERES = 'ATARDECERES',
  CIUDADELA_DEL_NORTE = 'CIUDADELA_DEL_NORTE',
  CUMANDAY = 'CUMANDAY',
  ECOTURISTICO_CERRO_DE_ORO = 'ECOTURISTICO_CERRO_DE_ORO',
  ESTACION = 'ESTACION',
  LA_FUENTE = 'LA_FUENTE',
  LA_MACARENA = 'LA_MACARENA',
  PALOGRANDE = 'PALOGRANDE',
  SAN_JOSE = 'SAN_JOSE',
  TESORITO = 'TESORITO',
  UNIVERSITARIA = 'UNIVERSITARIA',
  OTRA = 'OTRA',
}

/** Rubro/actividad económica del negocio. */
export enum Sector {
  ALIMENTOS_Y_BEBIDAS = 'ALIMENTOS_Y_BEBIDAS',
  ABARROTES_Y_TIENDA = 'ABARROTES_Y_TIENDA',
  ROPA_Y_CALZADO = 'ROPA_Y_CALZADO',
  BELLEZA_Y_CUIDADO_PERSONAL = 'BELLEZA_Y_CUIDADO_PERSONAL',
  SALUD = 'SALUD',
  EDUCACION = 'EDUCACION',
  TECNOLOGIA = 'TECNOLOGIA',
  CONSTRUCCION_Y_FERRETERIA = 'CONSTRUCCION_Y_FERRETERIA',
  TRANSPORTE = 'TRANSPORTE',
  SERVICIOS_PROFESIONALES = 'SERVICIOS_PROFESIONALES',
  ARTE_Y_ARTESANIAS = 'ARTE_Y_ARTESANIAS',
  AGROPECUARIO = 'AGROPECUARIO',
  OTRO = 'OTRO',
}

/** Nivel de afectación principal reportado por el negocio. */
export enum DamageLevel {
  SIN_AFECTACION = 'SIN_AFECTACION',
  AFECTACION_LEVE = 'AFECTACION_LEVE',
  AFECTACION_MODERADA = 'AFECTACION_MODERADA',
  LOCAL_INHABITABLE = 'LOCAL_INHABITABLE',
  PERDIDA_TOTAL = 'PERDIDA_TOTAL',
}

/** Tipo de publicación en el muro solidario. */
export enum SupportPostType {
  BUSCO = 'BUSCO',
  OFREZCO = 'OFREZCO',
}

/**
 * Estado de moderación de un contenido publicado.
 * Default en el backend: APROBADO (moderación reactiva, no pre-aprobación).
 */
export enum ModerationStatus {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

/** Tipo de contenido moderable (cola y bitácora de admin). */
export enum ModerationTargetType {
  BUSINESS = 'BUSINESS',
  PRODUCT = 'PRODUCT',
  SUPPORT_POST = 'SUPPORT_POST',
}

/** Acción registrada en ModerationAction (bitácora). */
export enum ModerationActionType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  BAN = 'BAN',
  UNBAN = 'UNBAN',
  SOFT_DELETE = 'SOFT_DELETE',
  RESTORE = 'RESTORE',
  EDIT_NOTE = 'EDIT_NOTE',
}
