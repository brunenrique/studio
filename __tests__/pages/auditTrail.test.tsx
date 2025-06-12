/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AuditTrailPage from '@/app/(app)/tools/audit-trail/page';
import { navigation } from '@/lib/navigation';

describe('Page: AuditTrail', () => {
  it('renders table with mock entries', () => {
    render(<AuditTrailPage />);
    expect(screen.getByRole('heading', { name: /Trilha de Auditoria/i })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

describe('Navigation', () => {
  it('includes audit trail route', () => {
    expect(navigation.some((n) => n.href === '/tools/audit-trail')).toBe(true);
  });
});
