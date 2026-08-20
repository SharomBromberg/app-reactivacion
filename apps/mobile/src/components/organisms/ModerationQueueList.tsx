import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ModerationTargetType } from '@plataforma/shared';
import { Chip, Skeleton } from '../atoms';
import { EmptyState, ErrorState, ModerationQueueCard } from '../molecules';
import { ModerationActionModal, type ModerationAction } from './ModerationActionModal';
import { colors, moderationTargetTypeLabels, radius, spacing } from '@/theme';
import type { QueueItem } from '@/features/admin/types';

export type ModerationQueueListProps = {
  items: QueueItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onAction: (item: QueueItem, action: ModerationAction, note?: string) => void;
  isActionSubmitting?: boolean;
};

const TABS: ModerationTargetType[] = [
  ModerationTargetType.BUSINESS,
  ModerationTargetType.PRODUCT,
  ModerationTargetType.SUPPORT_POST,
];

export function ModerationQueueList({
  items,
  isLoading = false,
  isError = false,
  onRetry,
  onAction,
  isActionSubmitting = false,
}: ModerationQueueListProps) {
  const [activeTab, setActiveTab] = useState<ModerationTargetType>(ModerationTargetType.BUSINESS);
  const [modalState, setModalState] = useState<{ item: QueueItem; action: ModerationAction } | null>(null);

  const filtered = items.filter((item) => item.targetType === activeTab);
  const closeModal = () => setModalState(null);

  const handleConfirm = (note?: string) => {
    if (!modalState) return;
    onAction(modalState.item, modalState.action, note);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <Chip
            key={tab}
            label={`${moderationTargetTypeLabels[tab]} (${items.filter((i) => i.targetType === tab).length})`}
            active={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      {isLoading ? (
        <View style={styles.list}>
          <QueueCardSkeleton />
          <QueueCardSkeleton />
        </View>
      ) : isError && filtered.length === 0 ? (
        <ErrorState onRetry={onRetry ?? (() => {})} description="No pudimos cargar la cola de moderación." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ModerationQueueCard
              item={item}
              onHide={() => setModalState({ item, action: 'hide' })}
              onRestore={() => setModalState({ item, action: 'restore' })}
              onBan={() => setModalState({ item, action: 'ban' })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="Sin pendientes"
              description="No hay contenido pendiente de moderación en esta categoría."
            />
          }
        />
      )}

      <ModerationActionModal
        visible={!!modalState}
        action={modalState?.action ?? null}
        itemTitle={modalState?.item.title ?? ''}
        onCancel={closeModal}
        onConfirm={handleConfirm}
        isSubmitting={isActionSubmitting}
      />
    </View>
  );
}

function QueueCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <Skeleton width="30%" height={12} />
      <Skeleton width="70%" height={16} />
      <Skeleton width="100%" height={44} radius={radius.md} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  skeletonCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[2] + 2,
    marginBottom: spacing[3],
  },
});
