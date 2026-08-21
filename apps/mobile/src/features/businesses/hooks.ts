import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBusiness,
  fetchBusiness,
  fetchBusinesses,
  type BusinessesQueryParams,
  type CreateBusinessPayload,
} from './api';

export function useBusinessesQuery(params: BusinessesQueryParams) {
  return useInfiniteQuery({
    queryKey: ['businesses', params],
    queryFn: ({ pageParam }) => fetchBusinesses({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // Al cambiar de filtro (zona/sector/búsqueda) cambia la queryKey; sin
    // esto React Query manda isPending=true un instante y la pantalla salta
    // a su vista de "cargando" (otro árbol de componentes) y de vuelta,
    // remontando todo lo que esté arriba de la lista — incluido el
    // ScrollView de filtros, reseteando su scroll. Mantener los datos
    // anteriores visibles evita ese salto de árbol por completo.
    placeholderData: keepPreviousData,
  });
}

export function useBusinessQuery(id: string) {
  return useQuery({
    queryKey: ['business', id],
    queryFn: () => fetchBusiness(id),
    enabled: !!id,
  });
}

export function useCreateBusinessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBusinessPayload) => createBusiness(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}
