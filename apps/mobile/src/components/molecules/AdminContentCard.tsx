import { Pressable, StyleSheet, View } from 'react-native';
import { ModerationStatus } from '@plataforma/shared';
import type { Sector, Zone } from '@plataforma/shared';
import { Text } from '../atoms';
import { colors, moderationStatusLabels, radius, sectorLabels, spacing, zoneLabels } from '@/theme';
import { formatRelativeTime } from '@/lib/formatRelativeTime';

export type AdminContentCardItem = {
  id: string;
  title: string;
  zone: Zone;
  sector: Sector | null;
  status: ModerationStatus;
  deletedAt: string | null;
  bannedAt: string | null;
  createdAt: string;
};

export type AdminContentCardProps = {
  item: AdminContentCardItem;
  onHide: () => void;
  onRestore: () => void;
  onBan: () => void;
};

function stateBadge(item: AdminContentCardItem): { label: string; color: string } {
  if (item.bannedAt) return { label: 'Baneado', color: colors.error };
  if (item.deletedAt) return { label: 'Oculto', color: colors.warning };
  if (item.status === ModerationStatus.APROBADO) return { label: 'Aprobado', color: colors.success };
  return { label: moderationStatusLabels[item.status], color: colors.textSecondary };
}

export function AdminContentCard({ item, onHide, onRestore, onBan }: AdminContentCardProps) {
  const badge = stateBadge(item);
  const isBanned = !!item.bannedAt;
  const isHidden = !!item.deletedAt;

  const metaParts = [zoneLabels[item.zone], item.sector ? sectorLabels[item.sector] : null].filter(
    (part): part is string => !!part,
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: `${badge.color}22` }]}>
          <Text variant="caption" color={badge.color} style={styles.badgeLabel}>
            {badge.label}
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

      {isBanned ? null : (
        <View style={styles.actionsRow}>
          {isHidden ? (
            <ActionButton label="Restaurar" itemTitle={item.title} color={colors.success} onPress={onRestore} />
          ) : (
            <ActionButton label="Ocultar" itemTitle={item.title} color={colors.warning} onPress={onHide} />
          )}
          <ActionButton label="Banear" itemTitle={item.title} color={colors.error} onPress={onBan} />
        </View>
      )}
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
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeLabel: {
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
