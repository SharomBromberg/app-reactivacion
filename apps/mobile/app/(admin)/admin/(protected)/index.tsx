import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ModerationTargetType } from '@plataforma/shared';
import { Icon, Text } from '@/components/atoms';
import { ModerationQueueList, type ModerationAction } from '@/components/organisms';
import { useModerateMutation, useModerationQueue } from '@/features/admin/hooks';
import type { QueueItem } from '@/features/admin/types';
import { colors, spacing } from '@/theme';

export default function AdminQueueScreen() {
  const router = useRouter();
  const queueQuery = useModerationQueue();
  const moderateMutation = useModerateMutation();

  const handleAction = (item: QueueItem, action: ModerationAction, note?: string) => {
    moderateMutation.mutate({ targetType: item.targetType as ModerationTargetType, id: item.id, action, note });
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="link"
        style={styles.historialLink}
        onPress={() => router.push('/admin/historial')}
      >
        <Text variant="label" color={colors.primary}>
          Ver historial de acciones
        </Text>
        <Icon name="adelante" size={16} color={colors.primary} />
      </Pressable>

      <ModerationQueueList
        items={queueQuery.data ?? []}
        isLoading={queueQuery.isPending}
        isError={queueQuery.isError}
        onRetry={() => queueQuery.refetch()}
        onAction={handleAction}
        isActionSubmitting={moderateMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  historialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    alignSelf: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});
