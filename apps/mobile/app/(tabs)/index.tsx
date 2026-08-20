import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Sector, Zone } from '@plataforma/shared';
import { Icon, Input, Text } from '@/components/atoms';
import { FilterBar } from '@/components/molecules';
import { BusinessList } from '@/components/organisms';
import { useBusinessesQuery } from '@/features/businesses/hooks';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { colors, sectorLabels, spacing, zoneLabels } from '@/theme';
import type { Business } from '@/lib/types';

const zoneOptions = Object.values(Zone).map((zone) => ({ label: zoneLabels[zone], value: zone }));
const sectorOptions = Object.values(Sector).map((sector) => ({ label: sectorLabels[sector], value: sector }));

export default function DirectorioScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [zone, setZone] = useState<Zone | null>(null);
  const [sector, setSector] = useState<Sector | null>(null);
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const query = useBusinessesQuery({ zone, sector, search: debouncedSearch || undefined });

  const businesses = useMemo<Business[]>(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  const header = (
    <View style={styles.header}>
      <Text variant="display" style={styles.title}>
        Directorio Solidario
      </Text>
      <View style={styles.searchRow}>
        <Icon name="buscar" size={18} color={colors.textSecondary} />
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre del negocio"
          style={styles.searchInput}
          accessibilityLabel="Buscar negocio por nombre"
          returnKeyType="search"
        />
      </View>
      <FilterBar options={zoneOptions} value={zone} onChange={setZone} allLabel="Todas las zonas" />
      <View style={{ height: spacing[2] }} />
      <FilterBar options={sectorOptions} value={sector} onChange={setSector} allLabel="Todos los sectores" />
    </View>
  );

  return (
    <BusinessList
      data={businesses}
      isLoading={query.isPending}
      isError={query.isError}
      onRetry={() => query.refetch()}
      onSelectBusiness={(business) => router.push(`/negocio/${business.id}`)}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing[3],
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
});
