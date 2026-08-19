/**
 * Campo honeypot anti-spam: los formularios públicos deben enviarlo vacío.
 * Cualquier valor no vacío cuenta como señal de bot, incluido un tipo
 * distinto de string (number, object, array): un bot que mande
 * `website: 1` o `website: {}` no debe colarse solo porque no es texto.
 */
export function isHoneypotFilled(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}
