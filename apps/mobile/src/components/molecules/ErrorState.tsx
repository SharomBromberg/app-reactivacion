import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from '../atoms';
import { colors, radius, spacing } from '@/theme';

export type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar la información. Revisa tu conexión e intenta de nuevo.',
  onRetry,
  retryLabel = 'Reintentar',
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alerta" size={24} color={colors.error} />
      </View>
      <Text variant="body" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color={colors.textSecondary} style={styles.description}>
        {description}
      </Text>
      <View style={styles.action}>
        <Button label={retryLabel} variant="secondary" onPress={onRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    gap: spacing[2] + 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.errorDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  action: {
    marginTop: spacing[1],
    minWidth: 160,
  },
});
