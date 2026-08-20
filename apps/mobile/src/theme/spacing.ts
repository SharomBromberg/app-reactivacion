// Base 4px — design/Styleguide - Directorio Solidario.dc.html §03
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const;

/** Área táctil mínima recomendada (48×48px). */
export const minTapTarget = spacing[12];
