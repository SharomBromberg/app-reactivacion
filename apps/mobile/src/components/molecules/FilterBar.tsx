import { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip } from '../atoms';
import { spacing } from '@/theme';

export type FilterOption<T extends string = string> = {
  label: string;
  value: T;
};

export type FilterBarProps<T extends string = string> = {
  options: FilterOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  allLabel?: string;
};

/**
 * memo(): un cambio de estado ajeno (ej. el texto de búsqueda) no debe
 * re-renderizar esta barra ni su ScrollView horizontal — evita cualquier
 * riesgo de que React trate el subárbol como "nuevo" y pierda la posición
 * de scroll. Las keys de los Chip son fijas por option.value, nunca
 * dependen del filtro activo.
 */
function FilterBarInner<T extends string = string>({
  options,
  value,
  onChange,
  allLabel = 'Todos',
}: FilterBarProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <Chip label={allLabel} active={value === null} onPress={() => onChange(null)} />
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            active={value === option.value}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

export const FilterBar = memo(FilterBarInner) as typeof FilterBarInner;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[4],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
});
