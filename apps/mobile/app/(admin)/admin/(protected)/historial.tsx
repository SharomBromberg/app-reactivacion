import { useMemo } from 'react';
import { ActionLogList } from '@/components/organisms';
import { useModerationActionsQuery } from '@/features/admin/hooks';
import type { ModerationAction } from '@/features/admin/types';

export default function AdminHistorialScreen() {
  const query = useModerationActionsQuery();

  const actions = useMemo<ModerationAction[]>(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  return (
    <ActionLogList
      data={actions}
      isLoading={query.isPending}
      isError={query.isError}
      onRetry={() => query.refetch()}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      }}
      isFetchingNextPage={query.isFetchingNextPage}
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
  );
}
