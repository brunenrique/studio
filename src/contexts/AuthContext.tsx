
"use client";

import type { User } from '@/lib/types';
import { mockUser } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          const data = snap.data() as Partial<User> | undefined;
          const mappedUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || '',
            email: fbUser.email || '',
            role: (data?.role as User['role']) || 'PSYCHOLOGIST',
            // A aprovação automática está habilitada por padrão
            isApproved: data?.isApproved ?? true,
            profileImage: fbUser.photoURL || undefined,
          };
          setUser(mappedUser);
          localStorage.setItem('psiguard_user', JSON.stringify(mappedUser));
        } catch (err) {
          console.error('Failed to load user profile', err);
          setUser(null);
        }
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
      try {
        await setDoc(doc(db, 'users', mockUser.id), {
          role: mockUser.role,
          isApproved: true,
          name: mockUser.name,
          email: mockUser.email,
        }, { merge: true });
      } catch (err) {
        console.error('Failed to save mock user', err);
      }
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
      let data: Partial<User> | undefined;
      const ref = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        // Novo usuário é aprovado automaticamente
        data = { role: 'PSYCHOLOGIST', isApproved: true };
        await setDoc(ref, data);
      } else {
        data = snap.data() as Partial<User>;
      }
      const mappedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || '',
        email: fbUser.email || '',
        role: (data?.role as User['role']) || 'PSYCHOLOGIST',
        // A aprovação automática está habilitada por padrão
        isApproved: data?.isApproved ?? true,
        profileImage: fbUser.photoURL || undefined,
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
