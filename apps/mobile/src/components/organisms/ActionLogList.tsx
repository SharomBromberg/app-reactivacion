import type { ReactElement, ReactNode } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Skeleton } from '../atoms';
import { ActionLogCard, EmptyState, ErrorState } from '../molecules';
import { colors, radius, spacing } from '@/theme';
import type { ModerationAction } from '@/features/admin/types';

export type ActionLogListProps = {
  data: ModerationAction[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  header?: ReactNode;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ActionLogList({
  data,
  isLoading = false,
  isError = false,
  onRetry,
  header,
  onEndReached,
  isFetchingNextPage = false,
  refreshing = false,
  onRefresh,
}: ActionLogListProps) {
  if (isLoading) {
    return (
      <View style={styles.list}>
        {header}
        <View style={styles.separatorGap}>
          <LogSkeleton />
          <LogSkeleton />
          <LogSkeleton />
        </View>
      </View>
    );
  }

  if (isError && data.length === 0) {
    return (
      <View style={styles.list}>
        {header}
        <ErrorState onRetry={onRetry ?? (() => {})} description="No pudimos cargar la bitácora. Revisa tu conexión e intenta de nuevo." />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ActionLogCard action={item} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
      contentContainerStyle={styles.list}
      // Elemento directo, no envuelto en función: ver comentario en BusinessList.tsx.
      ListHeaderComponent={header ? (header as ReactElement) : undefined}
      ListEmptyComponent={<EmptyState title="Sin acciones" description="Todavía no hay movimientos registrados." />}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={styles.footer} /> : null}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined
      }
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
      removeClippedSubviews
    />
  );
}

function LogSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <Skeleton width="35%" height={12} />
      <Skeleton width="60%" height={14} />
      <Skeleton width="90%" height={11} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing[4],
    gap: spacing[3],
  },
  separatorGap: {
    gap: spacing[3],
  },
  footer: {
    paddingVertical: spacing[4],
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[2] + 2,
  },
});
