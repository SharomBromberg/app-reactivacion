import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { createProductSchema, type CreateProductInput } from '@plataforma/shared';
import { Button, Input } from '../atoms';
import { FormField } from '../molecules';
import { spacing } from '@/theme';

export type ProductFormProps = {
  onSubmit: (values: CreateProductInput) => void;
  submitting?: boolean;
};

const defaultValues: CreateProductInput = {
  name: '',
  description: '',
  website: '',
};

export function ProductForm({ onSubmit, submitting = false }: ProductFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
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

      <FormField label="Nombre" error={errors.name?.message} helperText="Ej: Corte de cabello, Pan francés, Instalación de redes.">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Nombre del producto o servicio"
              maxLength={80}
              error={!!errors.name}
              accessibilityLabel="Nombre del producto o servicio"
            />
          )}
        />
      </FormField>

      <FormField label="Descripción (opcional)" error={errors.description?.message} helperText="Máximo 300 caracteres.">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Detalles, precio aproximado, disponibilidad..."
              multiline
              numberOfLines={4}
              maxLength={300}
              style={styles.textarea}
              error={!!errors.description}
              accessibilityLabel="Descripción del producto o servicio"
            />
          )}
        />
      </FormField>

      <Button
        label="Publicar producto"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        accessibilityLabel="Publicar producto"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[4],
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
