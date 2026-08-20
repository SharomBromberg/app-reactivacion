import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Icon } from './Icon';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

export type SelectProps<T extends string = string> = {
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: boolean;
  accessibilityLabel?: string;
};

export function Select<T extends string = string>({
  value,
  options,
  onChange,
  placeholder = 'Selecciona una opción',
  error = false,
  accessibilityLabel,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: selected ? selected.label : placeholder }}
        onPress={() => setOpen(true)}
        style={[styles.trigger, error && styles.error]}
      >
        <Text variant="body" color={selected ? colors.text : colors.textSecondary} numberOfLines={1} style={styles.triggerLabel}>
          {selected ? selected.label : placeholder}
        </Text>
        <Icon name="chevron-down" size={16} color={colors.textSecondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: item.value === value }}
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text variant="body" color={item.value === value ? colors.primary : colors.text}>
                    {item.label}
                  </Text>
                  {item.value === value && <Icon name="check" size={16} color={colors.primary} />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md + 2,
    padding: spacing[4] - 2,
    minHeight: 52,
  },
  triggerLabel: {
    flex: 1,
  },
  error: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '60%',
    paddingVertical: spacing[2],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4] - 2,
  },
});
