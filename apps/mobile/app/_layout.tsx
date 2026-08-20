import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { OfflineBanner } from '@/components/molecules';
import { setupOnlineManager } from '@/lib/networkStatus';
import { queryClient } from '@/lib/queryClient';
import { colors } from '@/theme';

export default function RootLayout() {
  useEffect(() => {
    setupOnlineManager();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <OfflineBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="negocio/[id]/index"
            options={{ headerShown: true, title: 'Detalle del negocio', headerBackTitle: 'Atrás' }}
          />
          <Stack.Screen
            name="negocio/[id]/producto-nuevo"
            options={{ headerShown: true, title: 'Agregar producto', headerBackTitle: 'Atrás', presentation: 'modal' }}
          />
          <Stack.Screen
            name="apoyo/nuevo"
            options={{ headerShown: true, title: 'Nueva publicación', headerBackTitle: 'Atrás', presentation: 'modal' }}
          />
          <Stack.Screen name="(admin)" />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
