"use client";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import type { User } from "@/lib/types";

const SESSION_KEY = "psiguard_session_id";

export function useSessionValidation(user: User | null, logout: () => void) {
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.id));
        const serverSession = (snap.data() as any)?.sessionId;
        const localSession = localStorage.getItem(SESSION_KEY);
        if (serverSession && localSession && serverSession !== localSession) {
          alert("Você foi desconectado por login em outro dispositivo.");
          logout();
        }
      } catch (err) {
        console.error("Session validation failed", err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user, logout]);
}
