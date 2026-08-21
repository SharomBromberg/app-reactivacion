import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { Icon } from '@/components/atoms';
import { useAdminAuth } from '@/features/admin/authContext';
import { colors } from '@/theme';

export default function ProtectedAdminLayout() {
  const { status, logout } = useAdminAuth();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (status !== 'authenticated') {
    return <Redirect href="/admin/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerRight: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            hitSlop={8}
            onPress={() => void logout()}
          >
            <Icon name="cerrar-sesion" size={22} color={colors.text} />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Cola de moderación' }} />
      <Stack.Screen name="contenido" options={{ title: 'Negocios y publicaciones' }} />
      <Stack.Screen name="historial" options={{ title: 'Historial' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
