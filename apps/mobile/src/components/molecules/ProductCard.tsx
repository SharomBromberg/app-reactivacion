import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from '../atoms';
import { colors, radius, spacing } from '@/theme';
import type { Product } from '@/lib/types';

export type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <View style={styles.card} accessibilityLabel={`${product.name}${product.description ? `, ${product.description}` : ''}`}>
      <Avatar name={product.name} size={44} />
      <View style={styles.info}>
        <Text variant="body" style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        {product.description ? (
          <Text variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.description}>
            {product.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  name: {
    fontWeight: '600',
  },
  description: {
    lineHeight: 20,
    marginTop: 4,
  },
});
