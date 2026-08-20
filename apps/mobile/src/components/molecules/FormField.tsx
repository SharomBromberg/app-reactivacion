import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from '../atoms';
import { colors, spacing } from '@/theme';

export type FormFieldProps = {
  label: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
};

export function FormField({ label, error, helperText, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text variant="label" color={error ? colors.error : colors.textSecondary}>
        {label}
      </Text>
      {children}
      {error ? (
        <View style={styles.errorRow}>
          <Icon name="alerta" size={13} color={colors.error} />
          <Text variant="caption" color={colors.error}>
            {error}
          </Text>
        </View>
      ) : helperText ? (
        <Text variant="caption" color={colors.textSecondary}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2] - 2,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
