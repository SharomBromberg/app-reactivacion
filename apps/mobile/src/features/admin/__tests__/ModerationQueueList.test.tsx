import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModerationTargetType } from '@plataforma/shared';
import { ModerationQueueList } from '@/components/organisms';
import * as adminApiModule from '../api';
import { useModerateMutation, useModerationQueue } from '../hooks';
import type { QueueItem } from '../types';

// Varias vueltas de act()/promesas encadenadas (onMutate -> mutationFn -> onSettled
// -> invalidate -> refetch); con carga en la máquina puede superar el timeout
// por test por defecto de Jest (5s).
jest.setTimeout(15000);

jest.mock('../api', () => ({
  fetchQueue: jest.fn(),
  hideContent: jest.fn(),
  restoreContent: jest.fn(),
  banContent: jest.fn(),
  fetchActions: jest.fn(),
  login: jest.fn(),
}));

const adminApi = adminApiModule as unknown as {
  fetchQueue: jest.Mock;
  hideContent: jest.Mock;
  restoreContent: jest.Mock;
  banContent: jest.Mock;
};

const queueItem: QueueItem = {
  id: 'biz-1',
  targetType: ModerationTargetType.BUSINESS,
  title: 'Panadería La Esperanza',
  zone: null,
  sector: null,
  createdAt: new Date().toISOString(),
};

function AdminQueueTestScreen() {
  const queueQuery = useModerationQueue();
  const moderateMutation = useModerateMutation();

  return (
    <ModerationQueueList
      items={queueQuery.data ?? []}
      isLoading={queueQuery.isPending}
      isError={queueQuery.isError}
      onRetry={() => queueQuery.refetch()}
      onAction={(item, action, note) =>
        moderateMutation.mutate({ targetType: item.targetType, id: item.id, action, note })
      }
      isActionSubmitting={moderateMutation.isPending}
    />
  );
}

function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AdminQueueTestScreen />
    </QueryClientProvider>,
  );
}

describe('Cola de moderación — Ocultar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Ocultar → confirmar → el ítem desaparece de la lista', async () => {
    // Backend "real": tras un hide exitoso, /admin/queue deja de devolver el ítem
    // (así refleja lo que hace onSettled al invalidar y refetchear).
    let hidden = false;
    adminApi.fetchQueue.mockImplementation(() => Promise.resolve(hidden ? [] : [queueItem]));
    adminApi.hideContent.mockImplementation(() => {
      hidden = true;
      return Promise.resolve({ id: queueItem.id, deletedAt: new Date().toISOString() });
    });

    renderScreen();

    expect(await screen.findByText(queueItem.title)).toBeTruthy();

    fireEvent.press(screen.getByLabelText(`Ocultar ${queueItem.title}`));
    expect(await screen.findByText('Ocultar contenido')).toBeTruthy();

    fireEvent.press(screen.getByTestId('moderation-action-confirm'));

    await waitFor(() => expect(adminApi.hideContent).toHaveBeenCalledWith(ModerationTargetType.BUSINESS, queueItem.id), {
      timeout: 3000,
    });

    await waitFor(() => expect(screen.queryByText(queueItem.title)).toBeNull(), { timeout: 3000 });
  });

  it('si el backend falla, el ítem sigue en la lista tras el rollback', async () => {
    adminApi.fetchQueue.mockResolvedValue([queueItem]);
    adminApi.hideContent.mockRejectedValue(new Error('network error'));

    renderScreen();

    expect(await screen.findByText(queueItem.title)).toBeTruthy();

    fireEvent.press(screen.getByLabelText(`Ocultar ${queueItem.title}`));
    fireEvent.press(await screen.findByTestId('moderation-action-confirm'));

    await waitFor(() => expect(adminApi.hideContent).toHaveBeenCalled());

    // La mutación falló → onError revierte al snapshot previo: el ítem sigue ahí.
    expect(screen.getByText(queueItem.title)).toBeTruthy();
  });
});
