/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { mockUser } from '../src/lib/mock-data';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
    user: {
      uid: mockUser.id,
      displayName: mockUser.name,
      email: mockUser.email,
      photoURL: mockUser.profileImage,
    },
  });
  (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
    user: {
      uid: mockUser.id,
      displayName: mockUser.name,
      email: mockUser.email,
      photoURL: mockUser.profileImage,
    },
  });
});

const mockSnap = (data?: any) => ({
  exists: () => !!data,
  data: () => data,
});

it('successful email/password login', async () => {
  (getDoc as jest.Mock).mockResolvedValue(mockSnap());
  (setDoc as jest.Mock).mockResolvedValue(undefined);
  (doc as jest.Mock).mockReturnValue('docref');

  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login(mockUser.email, 'pass');
  });

  expect(result.current.isAuthenticated).toBe(true);
  const push = (useRouter as jest.Mock).mock.results[0].value.push;
  expect(push).toHaveBeenCalledWith('/dashboard');
  expect(localStorage.getItem('psiguard_user')).toBeTruthy();
  expect(localStorage.getItem('psiguard_session_id')).toBeTruthy();
});

it('unapproved users are alerted and not logged in', async () => {
  window.alert = jest.fn();
  (getDoc as jest.Mock).mockResolvedValue(
    mockSnap({ isApproved: false })
  );
  (doc as jest.Mock).mockReturnValue('docref');

  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    await result.current.login(mockUser.email, 'pass');
  });

  expect(window.alert).toHaveBeenCalled();
  expect(result.current.isAuthenticated).toBe(false);
});

it('logout clears storage and redirects', async () => {
  (getDoc as jest.Mock).mockResolvedValue(mockSnap());
  (setDoc as jest.Mock).mockResolvedValue(undefined);
  (doc as jest.Mock).mockReturnValue('docref');

  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    await result.current.login(mockUser.email, 'pass');
  });
  expect(result.current.isAuthenticated).toBe(true);

  await act(async () => {
    result.current.logout();
  });

  const push = (useRouter as jest.Mock).mock.results[0].value.push;
  expect(push).toHaveBeenLastCalledWith('/login');
  expect(signOut).toHaveBeenCalled();
  expect(localStorage.getItem('psiguard_user')).toBeNull();
  expect(localStorage.getItem('psiguard_session_id')).toBeNull();
});

it('register creates user and session', async () => {
  (setDoc as jest.Mock).mockResolvedValue(undefined);
  (doc as jest.Mock).mockReturnValue('docref');

  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    await result.current.register('new@user.com', 'pass', 'PSYCHOLOGIST');
  });

  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
    expect.anything(),
    'new@user.com',
    'pass'
  );
  expect(setDoc).toHaveBeenCalledWith(
    'docref',
    expect.objectContaining({
      role: 'PSYCHOLOGIST',
      isApproved: false,
      email: 'new@user.com',
      sessionId: expect.any(String),
    })
  );
  expect(result.current.isAuthenticated).toBe(true);
  expect(localStorage.getItem('psiguard_user')).toBeTruthy();
  expect(localStorage.getItem('psiguard_session_id')).toBeTruthy();
});
