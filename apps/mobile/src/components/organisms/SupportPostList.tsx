import type { ReactElement, ReactNode } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Skeleton } from '../atoms';
import { EmptyState, ErrorState, SupportPostCard } from '../molecules';
import { colors, spacing } from '@/theme';
import type { SupportPost } from '@/lib/types';

export type SupportPostListProps = {
  data: SupportPost[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  header?: ReactNode;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function SupportPostList({
  data,
  isLoading = false,
  isError = false,
  onRetry,
  header,
  onEndReached,
  isFetchingNextPage = false,
  refreshing = false,
  onRefresh,
}: SupportPostListProps) {
  if (isLoading) {
    return (
      <View style={styles.list}>
        {header}
        <View style={styles.separatorGap}>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </View>
      </View>
    );
  }

  if (isError && data.length === 0) {
    return (
      <View style={styles.list}>
        {header}
        <ErrorState onRetry={onRetry ?? (() => {})} description="No pudimos cargar el muro. Revisa tu conexión e intenta de nuevo." />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SupportPostCard post={item} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
      contentContainerStyle={styles.list}
      // Elemento directo, no envuelto en función: ver comentario en BusinessList.tsx.
      ListHeaderComponent={header ? (header as ReactElement) : undefined}
      ListEmptyComponent={<EmptyState title="Sin publicaciones" description="Sé el primero en publicar en esta zona." />}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={styles.footer} /> : null}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined
      }
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
    />
  );
}

function PostSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <Skeleton width="40%" height={12} />
      <Skeleton width="80%" height={14} />
      <Skeleton width="100%" height={40} />
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
    borderRadius: 12,
    padding: spacing[4],
    gap: spacing[2] + 2,
  },
});
