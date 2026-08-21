import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { LoginInput } from '@plataforma/shared';
import { ApiError } from '@/lib/api';
import { Icon, Text } from '@/components/atoms';
import { AdminLoginForm } from '@/components/organisms';
import { useAdminAuth } from '@/features/admin/authContext';
import { colors, radius, spacing } from '@/theme';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login, status } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  const handleSubmit = async (values: LoginInput) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      router.replace('/admin');
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : 'No pudimos iniciar sesión. Revisa tu conexión e intenta de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/*
        Manifest propio (no el de la app pública): si un moderador entra acá
        desde el navegador y usa "Agregar a pantalla de inicio", le queda un
        ícono aparte ("Barrio Activo Moderador") que abre directo a este
        login en modo standalone, sin pasar por el directorio público.
      */}
      <Head>
        <link rel="manifest" href="/admin-manifest.json" />
        <meta name="theme-color" content="#6D3A18" />
        <link rel="icon" href="/admin-favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/admin-icon-192.png" />
      </Head>
      <View style={styles.header}>
        <Text variant="display" style={styles.title}>
          Panel de moderación
        </Text>
        <Text variant="body" color={colors.textSecondary}>
          Acceso solo para el equipo del proyecto.
        </Text>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Icon name="alerta" size={16} color={colors.error} />
          <Text variant="label" color={colors.error} style={{ flex: 1 }}>
            {error}
          </Text>
        </View>
      ) : null}

      <AdminLoginForm onSubmit={handleSubmit} submitting={submitting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[4],
    backgroundColor: colors.bg,
  },
  header: {
    gap: spacing[1],
    marginBottom: spacing[2],
  },
  title: {
    marginBottom: spacing[1],
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.errorDim,
    padding: spacing[3],
    borderRadius: radius.md,
  },
});
