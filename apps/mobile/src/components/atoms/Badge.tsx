import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';

export type BadgeStatus = 'visible' | 'en-revision' | 'oculto';

const config: Record<BadgeStatus, { label: string; icon: IconName; bg: string; fg: string }> = {
  visible: { label: 'Visible', icon: 'check', bg: colors.successDim, fg: colors.success },
  'en-revision': { label: 'En revisión', icon: 'alerta', bg: colors.warningDim, fg: colors.warning },
  oculto: { label: 'Oculto', icon: 'ojo-tachado', bg: colors.textSecondaryDim, fg: colors.textSecondary },
};

export type BadgeProps = {
  status: BadgeStatus;
};

export function Badge({ status }: BadgeProps) {
  const { label, icon, bg, fg } = config[status];
  return (
    <View style={[styles.base, { backgroundColor: bg }]}>
      <Icon name={icon} size={11} color={fg} />
      <Text variant="caption" color={fg} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2] - 2,
    paddingHorizontal: spacing[3],
    paddingVertical: 5,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
  },
});
