import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
