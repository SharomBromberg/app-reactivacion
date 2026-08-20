import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { createBusinessSchema, type CreateBusinessInput, DamageLevel, Sector, Zone } from '@plataforma/shared';
import { Button, Input, Select } from '../atoms';
import { FormField } from '../molecules';
import { damageLevelLabels, sectorLabels, spacing, zoneLabels } from '@/theme';

export type RegisterBusinessFormProps = {
  onSubmit: (values: CreateBusinessInput) => void;
  submitting?: boolean;
};

const zoneOptions = Object.values(Zone).map((zone) => ({ label: zoneLabels[zone], value: zone }));
const sectorOptions = Object.values(Sector).map((sector) => ({ label: sectorLabels[sector], value: sector }));
const damageOptions = Object.values(DamageLevel).map((level) => ({ label: damageLevelLabels[level], value: level }));

const defaultValues: CreateBusinessInput = {
  name: '',
  zone: undefined as unknown as Zone,
  sector: undefined as unknown as Sector,
  damageLevel: undefined as unknown as DamageLevel,
  phone: '',
  description: '',
  website: '',
};

export function RegisterBusinessForm({ onSubmit, submitting = false }: RegisterBusinessFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBusinessInput>({
    resolver: zodResolver(createBusinessSchema),
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

      <FormField label="Nombre del negocio" error={errors.name?.message} helperText="Escríbelo tal como aparece en tu negocio.">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Ej: Panadería La Esperanza"
              error={!!errors.name}
              accessibilityLabel="Nombre del negocio"
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

      <FormField label="Tipo de negocio" error={errors.sector?.message} helperText="Elige el que mejor describe tu negocio.">
        <Controller
          control={control}
          name="sector"
          render={({ field }) => (
            <Select
              value={field.value ?? null}
              options={sectorOptions}
              onChange={field.onChange}
              placeholder="Selecciona un tipo"
              error={!!errors.sector}
              accessibilityLabel="Tipo de negocio"
            />
          )}
        />
      </FormField>

      <FormField label="Afectación principal" error={errors.damageLevel?.message}>
        <Controller
          control={control}
          name="damageLevel"
          render={({ field }) => (
            <Select
              value={field.value ?? null}
              options={damageOptions}
              onChange={field.onChange}
              placeholder="Selecciona el nivel"
              error={!!errors.damageLevel}
              accessibilityLabel="Afectación principal"
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

      <FormField label="Descripción" error={errors.description?.message} helperText="¿Qué ofreces? Máximo 300 caracteres.">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Pan artesanal, arepas y pandebonos hechos a diario..."
              multiline
              numberOfLines={4}
              maxLength={300}
              style={styles.textarea}
              error={!!errors.description}
              accessibilityLabel="Descripción del negocio"
            />
          )}
        />
      </FormField>

      <Button
        label="Registrar negocio"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        accessibilityLabel="Registrar negocio"
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
