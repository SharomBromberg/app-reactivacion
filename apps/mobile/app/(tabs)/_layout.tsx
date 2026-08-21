import { Tabs } from 'expo-router';
import { Icon } from '@/components/atoms';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        // Solo el alto: el default de la librería (49px) queda muy justo
        // para ícono (28px) + etiqueta y se recorta en web. OJO — un
        // "height" en tabBarStyle reemplaza por completo el padding interno
        // que la librería calcula sola (insets.bottom, etc.), porque
        // tabBarStyle se aplica al final del mismo array de estilos: por
        // eso NO se agrega padding manual acá, alteraría ese cálculo y
        // recortaría el contenido por el otro lado.
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 58,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Directorio',
          tabBarIcon: ({ color, size }) => <Icon name="buscar" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="apoyo"
        options={{
          title: 'Apoyo',
          tabBarIcon: ({ color, size }) => <Icon name="escudo" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="registrar"
        options={{
          title: 'Registrar',
          tabBarIcon: ({ color, size }) => <Icon name="agregar" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}
