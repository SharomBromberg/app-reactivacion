import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors, fontFamily, type TextVariant, textVariants } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
};

export function Text({ variant = 'body', color = colors.text, style, ...rest }: TextProps) {
  return <RNText style={[styles.base, textVariants[variant], { color }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily,
  },
});
