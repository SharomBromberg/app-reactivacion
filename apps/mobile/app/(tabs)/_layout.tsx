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
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
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
