import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export type InputProps = TextInputProps & {
  error?: boolean;
};

export function Input({ error = false, style, ...rest }: InputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.textSecondary}
      style={[styles.base, error && styles.error, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md + 2,
    padding: spacing[4] - 2,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    borderWidth: 2,
    borderColor: colors.error,
  },
});
