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

export function FilterBar<T extends string = string>({ options, value, onChange, allLabel = 'Todos' }: FilterBarProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <Chip label={allLabel} active={value === null} onPress={() => onChange(null)} />
        {options.map((option) => (
          <Chip key={option.value} label={option.label} active={value === option.value} onPress={() => onChange(option.value)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[4],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
});
