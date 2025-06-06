
"use client";

import type { User } from '@/lib/types';
import { mockUser } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseClient';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Simplified login
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  // register: (email: string, pass: string, name: string) => Promise<void>; // Placeholder
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const mappedUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || '',
          email: fbUser.email || '',
          role: 'Psicólogo',
        };
        setUser(mappedUser);
        localStorage.setItem('psiguard_user', JSON.stringify(mappedUser));
      } else {
        const storedUser = localStorage.getItem('psiguard_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, you'd validate credentials against a backend.
    // For this mock, we'll use a hardcoded psychologist user if email matches.
    if (email === mockUser.email) {
      setUser(mockUser);
      localStorage.setItem('psiguard_user', JSON.stringify(mockUser));
      router.push('/dashboard');
    } else {
      // Basic error handling - in a real app, show a toast or error message
      console.error("Login failed: Invalid credentials");
      alert("Login failed. Use 'doctor.jane@psiguard.com' and any password.");
      setUser(null);
      localStorage.removeItem('psiguard_user');
    }
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const mappedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || '',
        email: fbUser.email || '',
        role: 'Psicólogo',
      };
      setUser(mappedUser);
      localStorage.setItem('psiguard_user', JSON.stringify(mappedUser));
      router.push('/dashboard');
    } catch (err) {
      console.error('Google login failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('psiguard_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
