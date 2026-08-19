/** Trim + elimina etiquetas HTML de un texto libre ingresado por el público. */
export function sanitizeText(value: string): string {
  return value.trim().replace(/<[^>]*>/g, '');
}
