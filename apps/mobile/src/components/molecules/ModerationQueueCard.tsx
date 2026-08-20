import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../atoms';
import { colors, moderationTargetTypeLabels, radius, sectorLabels, spacing, zoneLabels } from '@/theme';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import type { QueueItem } from '@/features/admin/types';

export type ModerationQueueCardProps = {
  item: QueueItem;
  onHide: () => void;
  onRestore: () => void;
  onBan: () => void;
};

export function ModerationQueueCard({ item, onHide, onRestore, onBan }: ModerationQueueCardProps) {
  const metaParts = [item.zone ? zoneLabels[item.zone] : null, item.sector ? sectorLabels[item.sector] : null].filter(
    (part): part is string => !!part,
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.typeBadge}>
          <Text variant="caption" color={colors.primary} style={styles.typeBadgeLabel}>
            {moderationTargetTypeLabels[item.targetType]}
          </Text>
        </View>
        <Text variant="caption" color={colors.textSecondary}>
          {formatRelativeTime(item.createdAt)}
        </Text>
      </View>

      <Text variant="body" style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {metaParts.length > 0 ? (
        <Text variant="caption" color={colors.textSecondary}>
          {metaParts.join(' · ')}
        </Text>
      ) : null}

      <View style={styles.actionsRow}>
        <ActionButton label="Restaurar" itemTitle={item.title} color={colors.success} onPress={onRestore} />
        <ActionButton label="Ocultar" itemTitle={item.title} color={colors.warning} onPress={onHide} />
        <ActionButton label="Banear" itemTitle={item.title} color={colors.error} onPress={onBan} />
      </View>
    </View>
  );
}

function ActionButton({
  label,
  itemTitle,
  color,
  onPress,
}: {
  label: string;
  itemTitle: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} ${itemTitle}`}
      onPress={onPress}
      style={({ pressed }) => [styles.actionButton, { backgroundColor: color, opacity: pressed ? 0.85 : 1 }]}
    >
      <Text variant="label" color={colors.textOnPrimary} style={styles.actionLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[2],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: colors.primaryDim,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  typeBadgeLabel: {
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  title: {
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[1],
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontWeight: '600',
  },
});
