"use client";

import type { User } from '@/lib/types';
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: true,
  isLoading: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  register: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={defaultContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
