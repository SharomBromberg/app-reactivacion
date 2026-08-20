import type { ReactNode } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Skeleton } from '../atoms';
import { BusinessCard, EmptyState, ErrorState } from '../molecules';
import { colors, radius, spacing } from '@/theme';
import type { Business } from '@/lib/types';

export type BusinessListProps = {
  data: Business[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onSelectBusiness: (business: Business) => void;
  header?: ReactNode;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function BusinessList({
  data,
  isLoading = false,
  isError = false,
  onRetry,
  onSelectBusiness,
  header,
  onEndReached,
  isFetchingNextPage = false,
  refreshing = false,
  onRefresh,
}: BusinessListProps) {
  if (isLoading) {
    return (
      <View style={styles.list}>
        {header}
        <View style={styles.separatorGap}>
          <BusinessCardSkeleton />
          <BusinessCardSkeleton />
          <BusinessCardSkeleton />
        </View>
      </View>
    );
  }

  // Si ya tenemos datos en caché (p. ej. sin conexión), los mostramos en vez de bloquear con el error.
  if (isError && data.length === 0) {
    return (
      <View style={styles.list}>
        {header}
        <ErrorState onRetry={onRetry ?? (() => {})} description="No pudimos cargar el directorio. Revisa tu conexión e intenta de nuevo." />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BusinessCard business={item} onPress={() => onSelectBusiness(item)} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
      contentContainerStyle={styles.list}
      ListHeaderComponent={header ? () => <>{header}</> : undefined}
      ListEmptyComponent={
        <EmptyState title="Sin resultados" description="Intenta con otro barrio o tipo de negocio." />
      }
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

function BusinessCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonRow}>
        <Skeleton width={44} height={44} radius={radius.md + 2} />
        <View style={styles.skeletonLines}>
          <Skeleton width="75%" height={14} />
          <Skeleton width="50%" height={11} />
        </View>
      </View>
      <Skeleton width="100%" height={11} />
      <Skeleton width="70%" height={11} />
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
  skeletonRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  skeletonLines: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing[2] - 2,
  },
});
