import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { CreateProductInput } from '@plataforma/shared';
import { ApiError } from '@/lib/api';
import { Button, Icon, Text } from '@/components/atoms';
import { ProductForm } from '@/components/organisms';
import { useCreateProductMutation } from '@/features/products/hooks';
import { colors, radius, spacing } from '@/theme';

export default function ProductoNuevoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const mutation = useCreateProductMutation();

  const handleSubmit = (values: CreateProductInput) => {
    mutation.mutate(
      {
        businessId: id,
        name: values.name,
        description: values.description || undefined,
        website: values.website,
      },
      { onSuccess: () => setSuccess(true) },
    );
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Icon name="check" size={28} color={colors.success} />
        </View>
        <Text variant="heading" style={styles.successTitle}>
          ¡Listo!
        </Text>
        <Text variant="body" color={colors.textSecondary} style={styles.successBody}>
          Tu producto o servicio ya está publicado en el negocio.
        </Text>
        <Button label="Volver al negocio" onPress={() => router.replace(`/negocio/${id}`)} />
        <View style={{ height: spacing[3] }} />
        <Button label="Agregar otro" variant="secondary" onPress={() => setSuccess(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text variant="display" style={styles.pageTitle}>
          Agregar producto o servicio
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          Se va a mostrar en el detalle de tu negocio, sin costo.
        </Text>
      </View>
      {mutation.isError ? (
        <View style={styles.errorBanner}>
          <Icon name="alerta" size={16} color={colors.error} />
          <Text variant="label" color={colors.error} style={{ flex: 1 }}>
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : 'No pudimos publicar el producto. Revisa tu conexión e intenta de nuevo.'}
          </Text>
        </View>
      ) : null}
      <ProductForm onSubmit={handleSubmit} submitting={mutation.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  pageHeader: {
    padding: spacing[4],
    paddingBottom: 0,
    gap: spacing[1],
  },
  pageTitle: {
    marginBottom: spacing[1],
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.errorDim,
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
    padding: spacing[3],
    borderRadius: radius.md,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.successDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  successTitle: {
    marginBottom: spacing[2],
  },
  successBody: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing[6],
  },
});
