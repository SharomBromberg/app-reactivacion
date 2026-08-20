import { Platform } from 'react-native';

// Tipografía del sistema — sin fuentes externas. Roboto en Android/web, San Francisco en iOS.
export const fontFamily = Platform.select({ web: "'Roboto', system-ui, -apple-system, sans-serif" });

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

export const textVariants = {
  display: { fontSize: 32, fontWeight: fontWeight.semibold, lineHeight: 38 },
  heading: { fontSize: 22, fontWeight: fontWeight.semibold, lineHeight: 26 },
  title: { fontSize: 18, fontWeight: fontWeight.semibold, lineHeight: 27 },
  body: { fontSize: 16, fontWeight: fontWeight.regular, lineHeight: 26 },
  label: { fontSize: 14, fontWeight: fontWeight.medium, lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: fontWeight.regular, lineHeight: 18 },
} as const;

export type TextVariant = keyof typeof textVariants;
