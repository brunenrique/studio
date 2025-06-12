'use client';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import axe from '@axe-core/react';

if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000);
}

export default function LoginPage() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only absolute top-0 left-0 z-50 bg-primary text-primary-foreground p-2">Pular para conteúdo</a>
      <main id="main" className="flex min-h-screen items-center justify-center p-4 bg-background">
        <form className="space-y-4 max-w-md w-full bg-card p-6 rounded-md shadow">
          <h1 className="text-2xl font-headline text-primary">Login</h1>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input id="email" type="email" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Senha</label>
            <input id="password" type="password" className="w-full p-2 border rounded" />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-primary text-primary-foreground rounded">Entrar</button>
        </form>
      </main>
    </>
  );
}
