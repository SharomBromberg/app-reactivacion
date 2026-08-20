import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { createSupportPostSchema, type CreateSupportPostInput, SupportPostType, Zone } from '@plataforma/shared';
import { Button, Chip, Input, Select } from '../atoms';
import { FormField } from '../molecules';
import { spacing, supportPostTypeLabels, zoneLabels } from '@/theme';

export type SupportPostFormProps = {
  onSubmit: (values: CreateSupportPostInput) => void;
  submitting?: boolean;
};

const zoneOptions = Object.values(Zone).map((zone) => ({ label: zoneLabels[zone], value: zone }));

const defaultValues: CreateSupportPostInput = {
  type: SupportPostType.BUSCO,
  title: '',
  description: '',
  zone: undefined as unknown as Zone,
  phone: '',
  website: '',
};

export function SupportPostForm({ onSubmit, submitting = false }: SupportPostFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSupportPostInput>({
    resolver: zodResolver(createSupportPostSchema),
    mode: 'onChange',
    defaultValues,
  });

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Honeypot anti-spam: campo oculto que un bot podría rellenar; un usuario real nunca lo ve ni lo toca. */}
      <Controller
        control={control}
        name="website"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={styles.honeypot}
            autoComplete="off"
            importantForAutofill="no"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        )}
      />

      <FormField label="Tipo de publicación">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <View style={styles.typeRow}>
              <Chip
                label={supportPostTypeLabels[SupportPostType.BUSCO]}
                active={field.value === SupportPostType.BUSCO}
                onPress={() => field.onChange(SupportPostType.BUSCO)}
              />
              <Chip
                label={supportPostTypeLabels[SupportPostType.OFREZCO]}
                active={field.value === SupportPostType.OFREZCO}
                onPress={() => field.onChange(SupportPostType.OFREZCO)}
              />
            </View>
          )}
        />
      </FormField>

      <FormField label="Título" error={errors.title?.message} helperText="Un resumen corto, máximo 80 caracteres.">
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Ej: Busco herramientas para reconstrucción"
              maxLength={80}
              error={!!errors.title}
              accessibilityLabel="Título de la publicación"
            />
          )}
        />
      </FormField>

      <FormField label="Barrio o zona" error={errors.zone?.message}>
        <Controller
          control={control}
          name="zone"
          render={({ field }) => (
            <Select
              value={field.value ?? null}
              options={zoneOptions}
              onChange={field.onChange}
              placeholder="Selecciona tu zona"
              error={!!errors.zone}
              accessibilityLabel="Barrio o zona"
            />
          )}
        />
      </FormField>

      <FormField label="Descripción" error={errors.description?.message} helperText="Máximo 300 caracteres.">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Cuéntanos con más detalle..."
              multiline
              numberOfLines={4}
              maxLength={300}
              style={styles.textarea}
              error={!!errors.description}
              accessibilityLabel="Descripción de la publicación"
            />
          )}
        />
      </FormField>

      <FormField label="Número de WhatsApp" error={errors.phone?.message} helperText="Así te podrán contactar los vecinos. 10 dígitos, sin +57.">
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="3001234567"
              keyboardType="phone-pad"
              maxLength={10}
              error={!!errors.phone}
              accessibilityLabel="Número de WhatsApp, 10 dígitos"
            />
          )}
        />
      </FormField>

      <Button
        label="Publicar en el muro"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        accessibilityLabel="Publicar en el muro"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[4],
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  honeypot: {
    position: 'absolute',
    left: -9999,
    width: 1,
    height: 1,
    opacity: 0,
  },
});
