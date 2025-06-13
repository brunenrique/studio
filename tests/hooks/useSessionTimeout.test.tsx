import { renderHook, act } from '@testing-library/react';
import useSessionTimeout from '../../src/hooks/use-session-timeout';

describe('Hook: useSessionTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('deve executar onTimeout após o período de inatividade', () => {
    const onTimeout = jest.fn();
    renderHook(() => useSessionTimeout(onTimeout, 1000));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onTimeout).toHaveBeenCalled();
  });

  test('deve reiniciar o timer quando há atividade do usuário', () => {
    const onTimeout = jest.fn();
    renderHook(() => useSessionTimeout(onTimeout, 1000));

    act(() => {
      jest.advanceTimersByTime(500);
      window.dispatchEvent(new Event('mousemove'));
      jest.advanceTimersByTime(500);
    });

    expect(onTimeout).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onTimeout).toHaveBeenCalled();
  });
});
