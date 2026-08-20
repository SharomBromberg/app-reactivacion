import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { toPhoneE164Co, type CreateBusinessInput } from '@plataforma/shared';
import { ApiError } from '@/lib/api';
import { Button, Icon, Text } from '@/components/atoms';
import { RegisterBusinessForm } from '@/components/organisms';
import { useCreateBusinessMutation } from '@/features/businesses/hooks';
import { colors, radius, spacing } from '@/theme';

export default function RegistrarScreen() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const mutation = useCreateBusinessMutation();

  const handleSubmit = (values: CreateBusinessInput) => {
    mutation.mutate(
      {
        name: values.name,
        zone: values.zone,
        sector: values.sector,
        damageLevel: values.damageLevel,
        phone: toPhoneE164Co(values.phone),
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
          Gracias por registrar tu negocio. Tu registro será visible en breve, luego de una revisión rápida del
          equipo.
        </Text>
        <Button label="Ir al directorio" onPress={() => router.push('/')} />
        <View style={{ height: spacing[3] }} />
        <Button label="Registrar otro negocio" variant="secondary" onPress={() => setSuccess(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text variant="display" style={styles.pageTitle}>
          Registra tu negocio
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          Solo pedimos lo necesario para que los vecinos te encuentren. No solicitamos datos financieros.
        </Text>
      </View>
      {mutation.isError ? (
        <View style={styles.errorBanner}>
          <Icon name="alerta" size={16} color={colors.error} />
          <Text variant="label" color={colors.error} style={{ flex: 1 }}>
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : 'No pudimos enviar tu registro. Revisa tu conexión e intenta de nuevo.'}
          </Text>
        </View>
      ) : null}
      <RegisterBusinessForm onSubmit={handleSubmit} submitting={mutation.isPending} />
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
