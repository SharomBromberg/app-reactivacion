import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { Icon } from './Icon';
import { Text } from './Text';
import { colors, radius } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
};

const textColorByVariant: Record<ButtonVariant, string> = {
  primary: colors.textOnPrimary,
  secondary: colors.primary,
  whatsapp: colors.whatsappText,
};

export function Button({ label, variant = 'primary', loading = false, disabled = false, style, ...rest }: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;
  const textColor = textColorByVariant[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={(state) => [
        styles.base,
        variantStyles[variant],
        pressed && pressedStyles[variant],
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading && <ActivityIndicator color={textColor} size="small" />}
      {variant === 'whatsapp' && !loading && <Icon name="whatsapp" size={20} color={textColor} />}
      <Text variant="body" color={textColor} style={styles.label}>
        {loading ? 'Cargando…' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  whatsapp: {
    backgroundColor: colors.whatsapp,
    borderWidth: 0,
  },
});

const pressedStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.97 }],
  },
  secondary: {
    backgroundColor: colors.primaryDim,
    transform: [{ scale: 0.97 }],
  },
  whatsapp: {
    backgroundColor: colors.whatsappPressed,
    transform: [{ scale: 0.97 }],
  },
});
