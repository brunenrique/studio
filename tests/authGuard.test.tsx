/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import AuthGuard from '../src/components/AuthGuard'
import { getCurrentUser } from '../src/lib/session'
import { redirect } from 'next/navigation'

jest.mock('../src/lib/session', () => ({ getCurrentUser: jest.fn() }))
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))

describe('AuthGuard', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children when user has role', async () => {
    ;(getCurrentUser as jest.Mock).mockResolvedValue({ id: '1', role: 'PSYCHOLOGIST' })

    const element = await AuthGuard({ role: 'PSYCHOLOGIST', children: <div>ok</div> })
    render(<>{element}</>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('redirects when role mismatch', async () => {
    ;(getCurrentUser as jest.Mock).mockResolvedValue({ id: '1', role: 'ADMIN' })

    await AuthGuard({ role: 'PSYCHOLOGIST', children: <div>ok</div> })
    expect(redirect).toHaveBeenCalledWith('/login')
  })
})
