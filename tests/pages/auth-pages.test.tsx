/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import LoginPage from '@/app/login/page';
import SignupPage from '@/app/signup/page';

describe('A11y', () => {
  it('login page has no violations', async () => {
    const { container } = render(<LoginPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('signup page has no violations', async () => {
    const { container } = render(<SignupPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
