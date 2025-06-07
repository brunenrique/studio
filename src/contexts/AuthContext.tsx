/* istanbul ignore file */
"use client";

import type { User, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSessionValidation } from '@/hooks/useSessionValidation';
import { auth, db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>; // Simplified login
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    pass: string,
    role: UserRole
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const SESSION_KEY = 'psiguard_session_id';

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
            isApproved: data?.isApproved ?? true,
            profileImage: fbUser.photoURL || undefined,
            sessionId: data?.sessionId,
          };

          if (!mappedUser.isApproved) {
            alert('Seu acesso ainda n\u00e3o foi aprovado.');
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('psiguard_user');
            router.push('/pending-approval');
            return;
          }

          const localSession = localStorage.getItem(SESSION_KEY);
          if (
            mappedUser.sessionId &&
            localSession &&
            mappedUser.sessionId !== localSession
          ) {
            alert('Voc\u00ea foi desconectado por login em outro dispositivo.');
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('psiguard_user');
            localStorage.removeItem(SESSION_KEY);
            router.push('/login');
            return;
          }

          setUser(mappedUser);
          localStorage.setItem('psiguard_user', JSON.stringify(mappedUser));
          if (mappedUser.sessionId) {
            localStorage.setItem(SESSION_KEY, mappedUser.sessionId);
          }
        } catch (err) {
          console.error('Failed to load user profile', err);
          setUser(null);
        }
        } else {
          const storedUser = localStorage.getItem('psiguard_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
        setIsLoading(false);
      });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;

      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);
      const data = snap.exists() ? (snap.data() as Partial<User>) : undefined;

      if (data && data.isApproved === false) {
        alert('Seu acesso ainda n\u00e3o foi aprovado.');
        await signOut(auth);
        setIsLoading(false);
        return;
      }

      const newSession = crypto.randomUUID();
      const mappedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || data?.name || '',
        email: fbUser.email || email,
        role: (data?.role as User['role']) || 'PSYCHOLOGIST',
        isApproved: data?.isApproved ?? true,
        profileImage: fbUser.photoURL || data?.profileImage,
        sessionId: newSession,
      };

      await setDoc(
        userRef,
        {
          role: mappedUser.role,
          isApproved: mappedUser.isApproved,
          name: mappedUser.name,
          email: mappedUser.email,
          sessionId: newSession,
        },
        { merge: true }
      );

      setUser(mappedUser);
      localStorage.setItem('psiguard_user', JSON.stringify(mappedUser));
      localStorage.setItem(SESSION_KEY, newSession);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
      alert('Erro ao fazer login. Verifique suas credenciais.');
      setUser(null);
      localStorage.removeItem('psiguard_user');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;
      const newSession = crypto.randomUUID();
      const uid = fbUser.uid;
      await setDoc(doc(db, 'users', uid), {
        role,
        isApproved: false,
        email,
        sessionId: newSession,
      });

      const mappedUser: User = {
        id: uid,
        name: fbUser.displayName || '',
        email: fbUser.email || email,
        role,
        isApproved: false,
        profileImage: fbUser.photoURL || undefined,
        sessionId: newSession,
      };

      setUser(mappedUser);
      localStorage.setItem('psiguard_user', JSON.stringify(mappedUser));
      localStorage.setItem(SESSION_KEY, newSession);
    } catch (err) {
      console.error('Registration failed', err);
    } finally {
      setIsLoading(false);
    }
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
      const newSession = crypto.randomUUID();
      const mappedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || '',
        email: fbUser.email || '',
        role: (data?.role as User['role']) || 'PSYCHOLOGIST',
        isApproved: data?.isApproved ?? true,
        profileImage: fbUser.photoURL || undefined,
        sessionId: newSession,
      };

      if (!mappedUser.isApproved) {
        alert('Seu acesso ainda n\u00e3o foi aprovado.');
        await signOut(auth);
        setIsLoading(false);
        return;
      }
      await setDoc(
        ref,
        {
          role: mappedUser.role,
          isApproved: mappedUser.isApproved,
          name: mappedUser.name,
          email: mappedUser.email,
          sessionId: newSession,
        },
        { merge: true }
      );

      setUser(mappedUser);
      localStorage.setItem('psiguard_user', JSON.stringify(mappedUser));
      localStorage.setItem(SESSION_KEY, newSession);
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
    localStorage.removeItem(SESSION_KEY);
    signOut(auth).catch(() => {});
    router.push('/login');
  };

  useSessionValidation(user, logout);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
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
