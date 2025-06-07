"use client";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import type { User } from "@/lib/types";

const SESSION_KEY = "psiguard_session_id";
// Default interval is 60 seconds when SESSION_VALIDATION_MS is not provided
const DEFAULT_INTERVAL = 60000;

export function useSessionValidation(user: User | null, logout: () => void) {
  useEffect(() => {
    if (!user) return;
    // Interval for checking session validity (defaults to 60s)
    const intervalMs = parseInt(
      process.env.SESSION_VALIDATION_MS || String(DEFAULT_INTERVAL),
    );
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
    }, intervalMs);
    return () => clearInterval(interval);
  }, [user, logout]);
}
