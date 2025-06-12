/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import NewPatientPage from '@/app/(app)/patients/new/page';
import { Toaster } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('E2E: criar paciente', () => {
  it('faz login, navega e cria paciente', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    // efetua login mockado
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.login();
    });

    render(
      <AuthProvider>
        <NewPatientPage />
        <Toaster />
      </AuthProvider>
    );

    await userEvent.type(screen.getByLabelText(/Nome/i), 'Ana');
    await userEvent.type(screen.getByLabelText(/Contato/i), 'ana@example.com');
    await userEvent.type(screen.getByLabelText(/CPF/i), '12345678901');
    await userEvent.type(screen.getByLabelText(/Data de Nascimento/i), '2000-01-01');

    await userEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    expect(await screen.findByText('Salvo')).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith('/patients');
  });
});
