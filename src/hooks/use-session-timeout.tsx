"use client";

import { useEffect, useRef, useCallback } from 'react';

const DEFAULT_TIMEOUT = 15 * 60 * 1000; // 15 minutes

/**
 * Hook que detecta inatividade do usuário e executa `onTimeout` após um período definido.
 * Listeners de eventos reiniciam o timer sempre que o usuário demonstra atividade.
 */
export function useSessionTimeout(
  onTimeout: () => void,
  timeoutMs: number = DEFAULT_TIMEOUT
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpa o timer atual
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Inicia (ou reinicia) o timer de inatividade
  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  }, [clearTimer, onTimeout, timeoutMs]);

  // Handler para qualquer evento de atividade
  const handleActivity = useCallback(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    // Inicia o timer assim que o hook monta
    startTimer();

    const events = ['mousemove', 'keydown', 'scroll'];
    events.forEach((evt) => window.addEventListener(evt, handleActivity));

    // Limpa os listeners e o timer ao desmontar
    return () => {
      clearTimer();
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [handleActivity, clearTimer, startTimer]);
}

export default useSessionTimeout;
