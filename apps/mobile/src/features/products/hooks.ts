import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, type CreateProductPayload } from './api';

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business', variables.businessId] });
    },
  });
}
