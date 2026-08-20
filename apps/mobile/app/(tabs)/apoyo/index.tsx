import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SupportPostType, Zone } from '@plataforma/shared';
import { Button, Chip, Text } from '@/components/atoms';
import { FilterBar } from '@/components/molecules';
import { SupportPostList } from '@/components/organisms';
import { useSupportPostsQuery } from '@/features/support-posts/hooks';
import { colors, spacing, supportPostTypeLabels, zoneLabels } from '@/theme';
import type { SupportPost } from '@/lib/types';

const zoneOptions = Object.values(Zone).map((zone) => ({ label: zoneLabels[zone], value: zone }));

export default function ApoyoScreen() {
  const router = useRouter();
  const [type, setType] = useState<SupportPostType | null>(null);
  const [zone, setZone] = useState<Zone | null>(null);

  const query = useSupportPostsQuery({ type, zone });

  const posts = useMemo<SupportPost[]>(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  const header = (
    <View style={styles.header}>
      <Text variant="display" style={styles.title}>
        Muro de Apoyo
      </Text>
      <Text variant="body" color={colors.textSecondary}>
        Pide lo que necesitas u ofrece una mano a tus vecinos.
      </Text>
      <Button
        label="Publicar en el muro"
        onPress={() => router.push('/apoyo/nuevo')}
        accessibilityLabel="Crear nueva publicación en el muro"
      />
      <View style={styles.typeRow}>
        <Chip label="Todos" active={type === null} onPress={() => setType(null)} />
        <Chip
          label={supportPostTypeLabels[SupportPostType.BUSCO]}
          active={type === SupportPostType.BUSCO}
          onPress={() => setType(SupportPostType.BUSCO)}
        />
        <Chip
          label={supportPostTypeLabels[SupportPostType.OFREZCO]}
          active={type === SupportPostType.OFREZCO}
          onPress={() => setType(SupportPostType.OFREZCO)}
        />
      </View>
      <FilterBar options={zoneOptions} value={zone} onChange={setZone} allLabel="Todas las zonas" />
    </View>
  );

  return (
    <SupportPostList
      data={posts}
      isLoading={query.isPending}
      isError={query.isError}
      onRetry={() => query.refetch()}
      header={header}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      }}
      isFetchingNextPage={query.isFetchingNextPage}
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  title: {
    marginBottom: spacing[1],
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
});
