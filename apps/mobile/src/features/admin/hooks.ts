import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ModerationTargetType } from '@plataforma/shared';
import {
  banContent,
  fetchActions,
  fetchAdminBusinesses,
  fetchAdminSupportPosts,
  fetchQueue,
  hideContent,
  restoreContent,
  type FetchAdminContentParams,
} from './api';
import type { QueueItem } from './types';

const QUEUE_KEY = ['admin', 'queue'] as const;

export function useModerationQueue() {
  return useQuery({
    queryKey: QUEUE_KEY,
    queryFn: fetchQueue,
  });
}

export type ModerateAction = 'hide' | 'restore' | 'ban';

export type ModerateVariables = {
  targetType: ModerationTargetType;
  id: string;
  action: ModerateAction;
  note?: string;
};

/**
 * Ocultar/Restaurar/Banear: optimista — el ítem sale de la cola de inmediato
 * (onMutate) y vuelve si la llamada falla (onError con el snapshot previo).
 */
export function useModerateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: ModerateVariables) => {
      if (vars.action === 'hide') return hideContent(vars.targetType, vars.id);
      if (vars.action === 'restore') return restoreContent(vars.targetType, vars.id);
      return banContent(vars.targetType, vars.id, vars.note ?? '');
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: QUEUE_KEY });
      const previous = queryClient.getQueryData<QueueItem[]>(QUEUE_KEY);

      queryClient.setQueryData<QueueItem[]>(QUEUE_KEY, (old) => (old ?? []).filter((item) => item.id !== vars.id));

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUEUE_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUEUE_KEY });
    },
  });
}

export function useModerationActionsQuery() {
  return useInfiniteQuery({
    queryKey: ['admin', 'actions'],
    queryFn: ({ pageParam }) => fetchActions({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

const ADMIN_BUSINESSES_KEY = ['admin', 'businesses'] as const;
const ADMIN_SUPPORT_POSTS_KEY = ['admin', 'support-posts'] as const;

export function useAdminBusinessesQuery(params: Pick<FetchAdminContentParams, 'search'>) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_BUSINESSES_KEY, params],
    queryFn: ({ pageParam }) => fetchAdminBusinesses({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useAdminSupportPostsQuery(params: Pick<FetchAdminContentParams, 'search'>) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_SUPPORT_POSTS_KEY, params],
    queryFn: ({ pageParam }) => fetchAdminSupportPosts({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export type AdminContentTargetType = ModerationTargetType.BUSINESS | ModerationTargetType.SUPPORT_POST;

export type AdminContentModerateVariables = {
  targetType: AdminContentTargetType;
  id: string;
  action: ModerateAction;
  note?: string;
};

/**
 * A diferencia de useModerateMutation (cola de pendientes, saca el ítem de
 * la lista al moderar), acá el ítem debe seguir visible con su nuevo status
 * — por eso invalida en vez de actualizar de forma optimista.
 */
export function useAdminContentModerateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: AdminContentModerateVariables) => {
      if (vars.action === 'hide') return hideContent(vars.targetType, vars.id);
      if (vars.action === 'restore') return restoreContent(vars.targetType, vars.id);
      return banContent(vars.targetType, vars.id, vars.note ?? '');
    },
    onSuccess: (_data, vars) => {
      const key = vars.targetType === ModerationTargetType.BUSINESS ? ADMIN_BUSINESSES_KEY : ADMIN_SUPPORT_POSTS_KEY;
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
