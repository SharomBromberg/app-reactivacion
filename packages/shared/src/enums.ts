// Enums de dominio compartidos entre apps/api y apps/mobile.
// Deben mantenerse en sync manualmente con apps/api/prisma/schema.prisma:
// Prisma no permite importar enums desde un archivo externo, así que estos
// son la copia "para TypeScript" del mismo vocabulario.

/**
 * Comunas urbanas de Manizales + zona rural/aledaña. Lista editable.
 * Orden de declaración = orden alfabético por label (con la zona rural al
 * final): los selects de la UI recorren `Object.values(Zone)` directamente,
 * así que este orden es el que ve el usuario.
 */
export enum Zone {
  ATARDECERES = 'ATARDECERES',
  CIUDADELA_DEL_NORTE = 'CIUDADELA_DEL_NORTE',
  CUMANDAY = 'CUMANDAY',
  ECOTURISTICO_CERRO_DE_ORO = 'ECOTURISTICO_CERRO_DE_ORO',
  LA_ESTACION = 'LA_ESTACION',
  LA_ESTRELLA = 'LA_ESTRELLA',
  LA_FUENTE = 'LA_FUENTE',
  LA_MACARENA = 'LA_MACARENA',
  NUEVO_HORIZONTE = 'NUEVO_HORIZONTE',
  PALOGRANDE = 'PALOGRANDE',
  SAN_JOSE = 'SAN_JOSE',
  TESORITO = 'TESORITO',
  UNIVERSITARIA = 'UNIVERSITARIA',
  RURAL_ALEDANA = 'RURAL_ALEDANA',
}

/** Nombres legibles de {@link Zone}, en el mismo orden que declara el enum. */
export const ZONE_LABELS: Record<Zone, string> = {
  [Zone.ATARDECERES]: 'Atardeceres',
  [Zone.CIUDADELA_DEL_NORTE]: 'Ciudadela del Norte',
  [Zone.CUMANDAY]: 'Cumanday',
  [Zone.ECOTURISTICO_CERRO_DE_ORO]: 'Ecoturístico Cerro de Oro',
  [Zone.LA_ESTACION]: 'La Estación',
  [Zone.LA_ESTRELLA]: 'La Estrella',
  [Zone.LA_FUENTE]: 'La Fuente',
  [Zone.LA_MACARENA]: 'La Macarena',
  [Zone.NUEVO_HORIZONTE]: 'Nuevo Horizonte',
  [Zone.PALOGRANDE]: 'Palogrande',
  [Zone.SAN_JOSE]: 'San José',
  [Zone.TESORITO]: 'Tesorito',
  [Zone.UNIVERSITARIA]: 'Universitaria',
  [Zone.RURAL_ALEDANA]: 'Zona rural o aledaña (Villamaría, corregimientos…)',
};

/**
 * Rubro/actividad económica del negocio. Orden de declaración = orden
 * alfabético por label, con OTRO al final (mismo criterio que {@link Zone}).
 */
export enum Sector {
  ALIMENTOS_RESTAURANTES = 'ALIMENTOS_RESTAURANTES',
  BELLEZA_CUIDADO = 'BELLEZA_CUIDADO',
  CONFECCION_COSTURA = 'CONFECCION_COSTURA',
  DISENO_ARTE = 'DISENO_ARTE',
  EDUCACION_CLASES = 'EDUCACION_CLASES',
  FERRETERIA_CONSTRUCCION = 'FERRETERIA_CONSTRUCCION',
  HOGAR_ASEO = 'HOGAR_ASEO',
  JARDINERIA_AGRO = 'JARDINERIA_AGRO',
  MASCOTAS = 'MASCOTAS',
  MECANICA_REPARACIONES = 'MECANICA_REPARACIONES',
  SALUD_BIENESTAR = 'SALUD_BIENESTAR',
  TECNOLOGIA_DIGITAL = 'TECNOLOGIA_DIGITAL',
  TIENDAS_VIVERES = 'TIENDAS_VIVERES',
  TRANSPORTE_MENSAJERIA = 'TRANSPORTE_MENSAJERIA',
  OTRO = 'OTRO',
}

/** Nombres legibles de {@link Sector}, en el mismo orden que declara el enum. */
export const SECTOR_LABELS: Record<Sector, string> = {
  [Sector.ALIMENTOS_RESTAURANTES]: 'Alimentos y restaurantes',
  [Sector.BELLEZA_CUIDADO]: 'Belleza y cuidado personal',
  [Sector.CONFECCION_COSTURA]: 'Confección y costura',
  [Sector.DISENO_ARTE]: 'Diseño y arte',
  [Sector.EDUCACION_CLASES]: 'Educación y clases',
  [Sector.FERRETERIA_CONSTRUCCION]: 'Ferretería y construcción',
  [Sector.HOGAR_ASEO]: 'Hogar y aseo',
  [Sector.JARDINERIA_AGRO]: 'Jardinería y agro',
  [Sector.MASCOTAS]: 'Mascotas',
  [Sector.MECANICA_REPARACIONES]: 'Mecánica y reparaciones',
  [Sector.SALUD_BIENESTAR]: 'Salud y bienestar',
  [Sector.TECNOLOGIA_DIGITAL]: 'Tecnología y servicios digitales',
  [Sector.TIENDAS_VIVERES]: 'Tiendas y víveres',
  [Sector.TRANSPORTE_MENSAJERIA]: 'Transporte y mensajería',
  [Sector.OTRO]: 'Otro',
};

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
