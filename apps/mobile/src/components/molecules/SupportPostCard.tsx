import { Linking, StyleSheet, View } from 'react-native';
import { SupportPostType } from '@plataforma/shared';
import { Button, Text } from '../atoms';
import { colors, radius, spacing, supportPostTypeLabels, zoneLabels } from '@/theme';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import type { SupportPost } from '@/lib/types';

export type SupportPostCardProps = {
  post: SupportPost;
};

const typeColor: Record<SupportPostType, string> = {
  [SupportPostType.BUSCO]: colors.warning,
  [SupportPostType.OFREZCO]: colors.secondary,
};

export function SupportPostCard({ post }: SupportPostCardProps) {
  const handleContact = () => {
    Linking.openURL(buildWhatsAppUrl(post.phone));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="caption" color={typeColor[post.type]} style={styles.type}>
          {supportPostTypeLabels[post.type]}
        </Text>
        <Text variant="caption" color={colors.textSecondary}>
          {zoneLabels[post.zone]}
        </Text>
      </View>
      <Text variant="body" style={styles.title} numberOfLines={1}>
        {post.title}
      </Text>
      <Text variant="body" color={colors.textSecondary} style={styles.description}>
        {post.description}
      </Text>
      <Button
        label="Escribir por WhatsApp"
        variant="whatsapp"
        onPress={handleContact}
        accessibilityLabel={`Escribir por WhatsApp sobre: ${post.title}`}
      />
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
    gap: spacing[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    lineHeight: 22,
  },
});
