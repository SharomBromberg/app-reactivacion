import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSupportPost,
  fetchSupportPosts,
  type CreateSupportPostPayload,
  type SupportPostsQueryParams,
} from './api';

export function useSupportPostsQuery(params: SupportPostsQueryParams) {
  return useInfiniteQuery({
    queryKey: ['support-posts', params],
    queryFn: ({ pageParam }) => fetchSupportPosts({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCreateSupportPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSupportPostPayload) => createSupportPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-posts'] });
    },
  });
}
