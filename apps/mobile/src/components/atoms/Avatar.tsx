import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors, radius } from '@/theme';

export type AvatarProps = {
  name: string;
  size?: number;
};

export function Avatar({ name, size = 44 }: AvatarProps) {
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size < 32 ? radius.sm : radius.md + 2 }]}>
      <Text variant="label" color={colors.primary} style={styles.initials}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0]?.[0] ?? '';
  const second = words.length > 1 ? (words[1]?.[0] ?? '') : '';
  return (first + second).toUpperCase();
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    fontWeight: '600',
  },
});
