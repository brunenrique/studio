import { renderHook, act } from '@testing-library/react';
import useNotifications from '@/hooks/useNotifications';
import { v4 as uuidv4 } from 'uuid';

// Mock a uuid library to have predictable IDs in tests
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('Hook: useNotifications', () => {
  let mockUuid: jest.Mock;

  beforeEach(() => {
    // Provide a unique id for each test
    mockUuid = uuidv4 as jest.Mock;
    mockUuid.mockImplementation(() => `test-id-${Math.random()}`);
    // Use fake timers to control setTimeout behavior
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers();
    // Clear mocks
    jest.clearAllMocks();
  });

  it('should start with an empty array of notifications', () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.notifications).toHaveLength(0);
  });

  it('should add a new notification when addNotification is called', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({ message: 'Operação realizada com sucesso.', type: 'success' });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toBe('Operação realizada com sucesso.');
    expect(result.current.notifications[0].type).toBe('success');
  });

  it('should remove a notification when removeNotification is called', () => {
    const { result } = renderHook(() => useNotifications());
    const testId = 'test-id-to-remove';
    mockUuid.mockReturnValue(testId);

    // Add a notification first
    act(() => {
      result.current.addNotification({ message: 'Notification to be removed.', type: 'info' });
    });

    expect(result.current.notifications).toHaveLength(1);

    // Now, remove it
    act(() => {
      result.current.removeNotification(testId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should automatically remove a notification after the specified duration', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        message: 'This will disappear soon.',
        type: 'warning',
        duration: 5000,
      });
    });

    // At this point, the notification should be in the array
    expect(result.current.notifications).toHaveLength(1);

    // Advance Jest's timers by 5000 ms
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Now, the notification should have been removed by the setTimeout callback
    expect(result.current.notifications).toHaveLength(0);
  });

  it('should not remove a notification if no duration is provided', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        message: 'This should stay.',
        type: 'info',
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    // Advance timers, but it should have no effect
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.notifications).toHaveLength(1);
  });
});
