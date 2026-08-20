import { StyleSheet, View } from 'react-native';
import { ModerationActionType } from '@plataforma/shared';
import { Text } from '../atoms';
import { colors, moderationActionTypeLabels, moderationTargetTypeLabels, radius, spacing } from '@/theme';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import type { ModerationAction } from '@/features/admin/types';

export type ActionLogCardProps = {
  action: ModerationAction;
};

const actionColor: Record<ModerationActionType, string> = {
  [ModerationActionType.APPROVE]: colors.success,
  [ModerationActionType.RESTORE]: colors.success,
  [ModerationActionType.UNBAN]: colors.success,
  [ModerationActionType.SOFT_DELETE]: colors.warning,
  [ModerationActionType.EDIT_NOTE]: colors.warning,
  [ModerationActionType.BAN]: colors.error,
  [ModerationActionType.REJECT]: colors.error,
};

export function ActionLogCard({ action }: ActionLogCardProps) {
  const color = actionColor[action.action];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
          <Text variant="caption" color={color} style={styles.badgeLabel}>
            {moderationActionTypeLabels[action.action]}
          </Text>
        </View>
        <Text variant="caption" color={colors.textSecondary}>
          {formatRelativeTime(action.createdAt)}
        </Text>
      </View>

      <Text variant="body" style={styles.summary}>
        {moderationTargetTypeLabels[action.targetType]} · {action.admin.name}
      </Text>

      {action.note ? (
        <Text variant="body" color={colors.textSecondary} style={styles.note}>
          {action.note}
        </Text>
      ) : null}
    </View>
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
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  summary: {
    fontWeight: '600',
  },
  note: {
    lineHeight: 20,
  },
});
