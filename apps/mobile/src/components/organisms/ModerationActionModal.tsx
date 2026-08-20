import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { banNoteSchema } from '@plataforma/shared';
import { Button, Input, Text } from '../atoms';
import { FormField } from '../molecules';
import { colors, radius, spacing } from '@/theme';

export type ModerationAction = 'hide' | 'restore' | 'ban';

export type ModerationActionModalProps = {
  visible: boolean;
  action: ModerationAction | null;
  itemTitle: string;
  onCancel: () => void;
  onConfirm: (note?: string) => void;
  isSubmitting?: boolean;
};

const copyByAction: Record<ModerationAction, { title: string; consequence: string; confirmLabel: string }> = {
  hide: {
    title: 'Ocultar contenido',
    consequence: 'Dejará de mostrarse al público. La persona que lo publicó puede corregirlo y no se pierde.',
    confirmLabel: 'Ocultar',
  },
  restore: {
    title: 'Restaurar contenido',
    consequence: 'Volverá a ser visible para todos los usuarios del directorio.',
    confirmLabel: 'Restaurar',
  },
  ban: {
    title: 'Banear contenido',
    consequence:
      'Acción irreversible desde este panel: el contenido deja de ser público. Deja una nota clara para el historial de auditoría.',
    confirmLabel: 'Banear',
  },
};

const confirmColorByAction: Record<ModerationAction, string> = {
  hide: colors.warning,
  restore: colors.success,
  ban: colors.error,
};

export function ModerationActionModal({
  visible,
  action,
  itemTitle,
  onCancel,
  onConfirm,
  isSubmitting = false,
}: ModerationActionModalProps) {
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setNote('');
      setTouched(false);
    }
  }, [visible, action]);

  if (!action) {
    return null;
  }

  const { title, consequence, confirmLabel } = copyByAction[action];
  const isBan = action === 'ban';
  const noteResult = isBan ? banNoteSchema.safeParse(note) : null;
  const noteError = touched && noteResult && !noteResult.success ? noteResult.error.issues[0]?.message : undefined;
  const canConfirm = !isBan || noteResult?.success === true;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text variant="title" accessibilityRole="header">
            {title}
          </Text>
          <Text variant="body" style={styles.itemTitle} numberOfLines={2}>
            {itemTitle}
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            {consequence}
          </Text>

          {isBan ? (
            <FormField label="Nota (obligatoria)" error={noteError} helperText="Explica brevemente el motivo del baneo.">
              <Input
                value={note}
                onChangeText={setNote}
                onBlur={() => setTouched(true)}
                placeholder="Ej: Contenido duplicado, datos falsos..."
                multiline
                numberOfLines={3}
                maxLength={300}
                error={!!noteError}
                accessibilityLabel="Nota del baneo, obligatoria"
                style={styles.noteInput}
              />
            </FormField>
          ) : null}

          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <Button label="Cancelar" variant="secondary" onPress={onCancel} disabled={isSubmitting} />
            </View>
            <View style={styles.actionButton}>
              <Button
                label={confirmLabel}
                testID="moderation-action-confirm"
                onPress={() => {
                  setTouched(true);
                  if (canConfirm) {
                    onConfirm(isBan ? note.trim() : undefined);
                  }
                }}
                loading={isSubmitting}
                disabled={!canConfirm}
                style={canConfirm ? { backgroundColor: confirmColorByAction[action] } : undefined}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing[4],
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing[4],
    gap: spacing[3],
  },
  itemTitle: {
    fontWeight: '600',
    marginTop: -spacing[1],
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  actionButton: {
    flex: 1,
  },
});
