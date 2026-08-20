export function buildWhatsAppUrl(phoneE164: string, message?: string): string {
  const phone = phoneE164.replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${query}`;
}
