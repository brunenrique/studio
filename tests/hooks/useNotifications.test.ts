import { renderHook, act } from '@testing-library/react';
import useNotifications from '../../src/hooks/useNotifications';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('Hook: useNotifications', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('deve iniciar com uma lista de notificações vazia', () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.notifications).toHaveLength(0);
  });

  test('deve adicionar uma nova notificação quando addNotification é chamada', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ message: 'Sucesso!', type: 'success' });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      id: 'test-uuid',
      message: 'Sucesso!',
      type: 'success',
    });
  });

  test('deve remover uma notificação quando removeNotification é chamada', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ message: 'Para remover', type: 'info' });
    });

    expect(result.current.notifications).toHaveLength(1);
    const notificationId = result.current.notifications[0].id;

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  test('deve remover a notificação automaticamente após a duração especificada', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        message: 'Auto-remove',
        type: 'warning',
        duration: 5000,
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
