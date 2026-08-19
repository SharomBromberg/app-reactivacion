import type { Product } from '@prisma/client';

/** DTO de salida pública: nunca expone moderationNote ni otros campos internos. */
export interface ProductResponseDto {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export function toProductResponse(product: Product): ProductResponseDto {
  return {
    id: product.id,
    businessId: product.businessId,
    name: product.name,
    description: product.description,
    createdAt: product.createdAt,
  };
}
