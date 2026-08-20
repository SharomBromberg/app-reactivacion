import { Linking, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Icon, Skeleton, Text } from '@/components/atoms';
import { ErrorState, ProductCard } from '@/components/molecules';
import { useBusinessQuery } from '@/features/businesses/hooks';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { colors, damageLevelLabels, radius, sectorLabels, spacing, zoneLabels } from '@/theme';

const WHATSAPP_MESSAGE = 'Hola, vi tu negocio en la Plataforma de Reactivación y quiero…';

export default function NegocioDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useBusinessQuery(id);

  if (query.isPending) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Skeleton width="70%" height={28} />
        <View style={{ height: spacing[2] }} />
        <Skeleton width="45%" height={14} />
        <View style={{ height: spacing[4] }} />
        <Skeleton width="100%" height={80} />
      </ScrollView>
    );
  }

  if (query.isError || !query.data) {
    return (
      <View style={styles.container}>
        <ErrorState
          title="No pudimos cargar este negocio"
          description="Revisa tu conexión e intenta de nuevo."
          onRetry={() => query.refetch()}
        />
      </View>
    );
  }

  const business = query.data;

  const handleContact = () => {
    Linking.openURL(buildWhatsAppUrl(business.phone, WHATSAPP_MESSAGE));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} tintColor={colors.primary} />}
    >
      <Text variant="heading" accessibilityRole="header">
        {business.name}
      </Text>
      <Text variant="label" color={colors.textSecondary} style={styles.meta}>
        {zoneLabels[business.zone]} · {sectorLabels[business.sector]}
      </Text>
      <Text variant="caption" color={colors.warning} style={styles.damage}>
        {damageLevelLabels[business.damageLevel]}
      </Text>

      {business.description ? (
        <Text variant="body" color={colors.textSecondary} style={styles.description}>
          {business.description}
        </Text>
      ) : null}

      <Button
        label="Contactar por WhatsApp"
        variant="whatsapp"
        onPress={handleContact}
        accessibilityLabel={`Contactar a ${business.name} por WhatsApp`}
        style={styles.whatsappButton}
      />

      <View style={styles.disclaimer}>
        <Icon name="escudo" size={14} color={colors.textSecondary} />
        <Text variant="caption" color={colors.textSecondary} style={{ flex: 1 }}>
          Esta plataforma no procesa pagos. Todo acuerdo de compra o entrega es directamente entre tú y el negocio.
        </Text>
      </View>

      <Text variant="title" style={styles.productsTitle}>
        Productos y servicios
      </Text>
      {business.products.length === 0 ? (
        <Text variant="body" color={colors.textSecondary}>
          Este negocio aún no ha publicado productos o servicios.
        </Text>
      ) : (
        <View style={styles.productsList}>
          {business.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    paddingBottom: spacing[16],
  },
  meta: {
    marginTop: spacing[1],
  },
  damage: {
    marginTop: spacing[1],
    fontWeight: '600',
  },
  description: {
    marginTop: spacing[4],
    lineHeight: 24,
  },
  whatsappButton: {
    marginTop: spacing[6],
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginTop: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
  },
  productsTitle: {
    marginTop: spacing[8],
    marginBottom: spacing[3],
  },
  productsList: {
    gap: spacing[3],
  },
});
