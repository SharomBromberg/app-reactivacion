import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Icon, Text } from '../atoms';
import { colors, radius, sectorLabels, spacing, zoneLabels } from '@/theme';
import type { Business } from '@/lib/types';

export type BusinessCardProps = {
  business: Business;
  onPress?: () => void;
};

export function BusinessCard({ business, onPress }: BusinessCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${business.name}, ${zoneLabels[business.zone]}, ${sectorLabels[business.sector]}`}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.row}>
        <Avatar name={business.name} size={44} />
        <View style={styles.info}>
          <Text variant="body" style={styles.name} numberOfLines={1}>
            {business.name}
          </Text>
          <Text variant="caption" color={colors.textSecondary} numberOfLines={1}>
            {zoneLabels[business.zone]} · {sectorLabels[business.sector]}
          </Text>
        </View>
        <Icon name="adelante" size={18} color={colors.primary} />
      </View>
      {business.description ? (
        <Text variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.description}>
          {business.description}
        </Text>
      ) : null}
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
    gap: spacing[3] - 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: '600',
    marginBottom: 3,
  },
  description: {
    lineHeight: 20,
  },
});
