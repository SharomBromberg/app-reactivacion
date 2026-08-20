import { useNetInfo } from '@react-native-community/netinfo';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from '../atoms';
import { colors, spacing } from '@/theme';

export function OfflineBanner() {
  const netInfo = useNetInfo();

  // isConnected empieza en null mientras NetInfo resuelve el estado inicial;
  // solo mostramos el aviso cuando estamos seguros de que no hay conexión.
  if (netInfo.isConnected !== false) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Icon name="alerta" size={16} color={colors.warning} />
      <Text variant="label" color={colors.warning} style={styles.text}>
        Estás sin conexión. Mostrando lo último guardado.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.warningDim,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  text: {
    flex: 1,
  },
});
