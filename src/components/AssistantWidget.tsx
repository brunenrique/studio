"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import type { Pipeline } from "@xenova/transformers";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [generator, setGenerator] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (open && !generator && typeof window !== "undefined") {
      setLoading(true);
      setError(null);
      import("@xenova/transformers")
        .then(async (mod) => {
          const pipe = await mod.pipeline(
            "text-generation",
            "Xenova/gpt2",
            { quantized: true }
          );
          if (!cancelled) {
            setGenerator(pipe);
          }
        })
        .catch((err) => {
          console.error("Failed to load model", err);
          if (!cancelled) setError("Falha ao carregar o modelo");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [open, generator]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { sender: "user", text }]);
    setInput("");
    if (!generator) return;
    setLoading(true);
    const out = await generator(
      `Responda em portugues de forma concisa: ${text}`,
      { max_new_tokens: 60 }
    );
    const reply = (out[0] as any).generated_text.trim();
    setMessages((m) => [...m, { sender: "bot", text: reply }]);
    setLoading(false);
    if (window.speechSynthesis) {
      const utter = new SpeechSynthesisUtterance(reply);
      speechSynthesis.speak(utter);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  useEffect(() => {
    const div = containerRef.current;
    if (div) div.scrollTop = div.scrollHeight;
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50 text-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full bg-primary text-white shadow-md"
        aria-label="Abrir assistente"
      >
        <MessageCircle size={20} />
      </button>
      {open && (
        <div className="w-72 h-80 bg-white rounded-md shadow-lg p-2 flex flex-col space-y-2 mt-2" ref={containerRef}>
          <div className="flex-1 overflow-y-auto space-y-1">
            {messages.map((m, i) => (
              <div key={i} className={m.sender === "user" ? "text-right" : "text-left"}>
                <span className="inline-block rounded px-2 py-1 bg-muted">
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            className="w-full border rounded p-1"
            placeholder={
              error ?? (loading ? "Carregando modelo..." : "Digite sua pergunta")
            }
            disabled={loading || !generator}
          />
          <button
            onClick={send}
            disabled={loading || !generator}
            className="bg-primary text-white rounded px-2 py-1 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}

