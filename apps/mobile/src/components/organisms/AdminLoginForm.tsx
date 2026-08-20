import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { loginSchema, type LoginInput } from '@plataforma/shared';
import { Button, Input } from '../atoms';
import { FormField } from '../molecules';
import { spacing } from '@/theme';

export type AdminLoginFormProps = {
  onSubmit: (values: LoginInput) => void;
  submitting?: boolean;
};

const defaultValues: LoginInput = { email: '', password: '' };

export function AdminLoginForm({ onSubmit, submitting = false }: AdminLoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues,
  });

  return (
    <View style={styles.container}>
      <FormField label="Correo" error={errors.email?.message}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="moderador@ejemplo.org"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!errors.email}
              accessibilityLabel="Correo del moderador"
            />
          )}
        />
      </FormField>

      <FormField label="Contraseña" error={errors.password?.message}>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              error={!!errors.password}
              accessibilityLabel="Contraseña del moderador"
            />
          )}
        />
      </FormField>

      <Button label="Iniciar sesión" onPress={handleSubmit(onSubmit)} loading={submitting} accessibilityLabel="Iniciar sesión" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
});
