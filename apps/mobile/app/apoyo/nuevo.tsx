import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { toPhoneE164Co, type CreateSupportPostInput } from '@plataforma/shared';
import { ApiError } from '@/lib/api';
import { Button, Icon, Text } from '@/components/atoms';
import { SupportPostForm } from '@/components/organisms';
import { useCreateSupportPostMutation } from '@/features/support-posts/hooks';
import { colors, radius, spacing } from '@/theme';

export default function NuevaPublicacionScreen() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const mutation = useCreateSupportPostMutation();

  const handleSubmit = (values: CreateSupportPostInput) => {
    mutation.mutate(
      {
        type: values.type,
        title: values.title,
        description: values.description,
        zone: values.zone,
        phone: toPhoneE164Co(values.phone),
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
          ¡Publicado!
        </Text>
        <Text variant="body" color={colors.textSecondary} style={styles.successBody}>
          Tu publicación será visible en el muro en breve, luego de una revisión rápida del equipo.
        </Text>
        <Button label="Volver al muro" onPress={() => router.replace('/apoyo')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {mutation.isError ? (
        <View style={styles.errorBanner}>
          <Icon name="alerta" size={16} color={colors.error} />
          <Text variant="label" color={colors.error} style={{ flex: 1 }}>
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : 'No pudimos enviar tu publicación. Revisa tu conexión e intenta de nuevo.'}
          </Text>
        </View>
      ) : null}
      <SupportPostForm onSubmit={handleSubmit} submitting={mutation.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
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
