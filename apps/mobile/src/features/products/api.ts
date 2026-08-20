import { api } from '@/lib/api';

export type CreateProductPayload = {
  businessId: string;
  name: string;
  description?: string;
  /** Honeypot anti-spam: siempre vacío en envíos reales. */
  website?: string;
};

export function createProduct(payload: CreateProductPayload): Promise<unknown> {
  return api.post('/products', payload);
}
