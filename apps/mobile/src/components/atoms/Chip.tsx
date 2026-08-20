import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';

export type ChipProps = Omit<PressableProps, 'children'> & {
  label: string;
  active?: boolean;
};

export function Chip({ label, active = false, style, ...rest }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      style={(state) => [
        styles.base,
        active ? styles.active : styles.inactive,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <Text variant="label" color={active ? colors.primary : colors.textSecondary} style={active ? styles.activeLabel : undefined}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  active: {
    backgroundColor: colors.primaryDim,
    borderColor: colors.primary,
  },
  inactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  activeLabel: {
    fontWeight: '500',
  },
});
