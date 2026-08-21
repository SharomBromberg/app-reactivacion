import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ModerationTargetType } from '@plataforma/shared';
import { Chip, Icon, Input, Skeleton } from '../atoms';
import { AdminContentCard, EmptyState, ErrorState, type AdminContentCardItem } from '../molecules';
import { ModerationActionModal, type ModerationAction } from './ModerationActionModal';
import {
  useAdminBusinessesQuery,
  useAdminContentModerateMutation,
  useAdminSupportPostsQuery,
  type AdminContentTargetType,
} from '@/features/admin/hooks';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { colors, moderationTargetTypeLabels, radius, spacing } from '@/theme';

const TABS: AdminContentTargetType[] = [ModerationTargetType.BUSINESS, ModerationTargetType.SUPPORT_POST];

export function AdminContentList() {
  const [activeTab, setActiveTab] = useState<AdminContentTargetType>(ModerationTargetType.BUSINESS);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);
  const [modalState, setModalState] = useState<{
    item: AdminContentCardItem;
    targetType: AdminContentTargetType;
    action: ModerationAction;
  } | null>(null);

  const businessesQuery = useAdminBusinessesQuery({ search: debouncedSearch || undefined });
  const supportPostsQuery = useAdminSupportPostsQuery({ search: debouncedSearch || undefined });
  const moderateMutation = useAdminContentModerateMutation();

  const activeQuery = activeTab === ModerationTargetType.BUSINESS ? businessesQuery : supportPostsQuery;

  const items = useMemo<AdminContentCardItem[]>(() => {
    if (activeTab === ModerationTargetType.BUSINESS) {
      return (businessesQuery.data?.pages.flatMap((page) => page.items) ?? []).map((business) => ({
        id: business.id,
        title: business.name,
        zone: business.zone,
        sector: business.sector,
        status: business.status,
        deletedAt: business.deletedAt,
        bannedAt: business.bannedAt,
        createdAt: business.createdAt,
      }));
    }
    return (supportPostsQuery.data?.pages.flatMap((page) => page.items) ?? []).map((post) => ({
      id: post.id,
      title: post.title,
      zone: post.zone,
      sector: post.sector,
      status: post.status,
      deletedAt: post.deletedAt,
      bannedAt: post.bannedAt,
      createdAt: post.createdAt,
    }));
  }, [activeTab, businessesQuery.data, supportPostsQuery.data]);

  const closeModal = () => setModalState(null);

  const handleConfirm = (note?: string) => {
    if (!modalState) return;
    moderateMutation.mutate({
      targetType: modalState.targetType,
      id: modalState.item.id,
      action: modalState.action,
      note,
    });
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Icon name="buscar" size={18} color={colors.textSecondary} />
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre o título"
          style={styles.searchInput}
          accessibilityLabel="Buscar negocio o publicación"
          returnKeyType="search"
        />
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <Chip
            key={tab}
            label={moderationTargetTypeLabels[tab]}
            active={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      {activeQuery.isPending ? (
        <View style={styles.list}>
          <Skeleton width="100%" height={92} radius={radius.lg} />
          <Skeleton width="100%" height={92} radius={radius.lg} />
        </View>
      ) : activeQuery.isError && items.length === 0 ? (
        <ErrorState onRetry={() => activeQuery.refetch()} description="No pudimos cargar el contenido." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AdminContentCard
              item={item}
              onHide={() => setModalState({ item, targetType: activeTab, action: 'hide' })}
              onRestore={() => setModalState({ item, targetType: activeTab, action: 'restore' })}
              onBan={() => setModalState({ item, targetType: activeTab, action: 'ban' })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
          contentContainerStyle={styles.list}
          onEndReached={() => {
            if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
              activeQuery.fetchNextPage();
            }
          }}
          ListEmptyComponent={
            <EmptyState title="Sin resultados" description="No hay negocios o publicaciones para mostrar." />
          }
        />
      )}

      <ModerationActionModal
        visible={!!modalState}
        action={modalState?.action ?? null}
        itemTitle={modalState?.item.title ?? ''}
        onCancel={closeModal}
        onConfirm={handleConfirm}
        isSubmitting={moderateMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing[3],
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    padding: spacing[4],
    paddingBottom: spacing[2],
  },
  list: {
    padding: spacing[4],
    gap: spacing[3],
  },
});
