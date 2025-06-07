"use client";

import { useState, useEffect } from "react";
import type { TextGenerationPipeline } from "@xenova/transformers";

export function useTransformersPipeline(open: boolean) {
  const [generator, setGenerator] = useState<TextGenerationPipeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (
        open &&
        !generator &&
        typeof window !== "undefined" &&
        typeof WebAssembly !== "undefined" &&
        typeof fetch !== "undefined"
      ) {
        setLoading(true);
        setError(null);
        try {
          const mod = await import("@xenova/transformers");
          const pipe = (await mod.pipeline(
            "text-generation",
            "Xenova/gpt2",
            { quantized: true }
          )) as TextGenerationPipeline;
          if (!cancelled) {
            setGenerator(pipe);
          }
        } catch (err) {
          console.error("Failed to load model", err);
          if (!cancelled) setError("Falha ao carregar o modelo");
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [open, generator]);

  return { generator, loading, error };
}
