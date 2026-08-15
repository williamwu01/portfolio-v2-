"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "What projects has William built?",
  "What makes Aurora technically impressive?",
  "Tell me about the Threadboard architecture",
  "What's William's design philosophy?",
];

export default function AISearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSearch = useCallback(
    async (q: string = query) => {
      if (!q.trim() || loading) return;
      setLoading(true);
      setResponse("");
      setQuery(q);

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });

        if (!res.ok || !res.body) throw new Error("Search failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setResponse((prev) => prev + decoder.decode(value));
        }
      } catch {
        setResponse("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [query, loading],
  );

  function handleReset() {
    setResponse("");
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/70 backdrop-blur-md"
      />

      {/* Search panel */}
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        {/* ── Spinning gradient border input ── */}
        <div
          className="relative rounded-2xl p-[2px] overflow-hidden"
          style={{ boxShadow: "0 0 24px -4px rgba(167,139,250,0.45)" }}
        >
          {/* Rotating purple comet — large square spins inside clipped container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="animate-spin-gradient shrink-0"
              style={{
                width: "200%",
                aspectRatio: "1 / 1",
                background:
                  "conic-gradient(from 0deg, transparent 0%, #6d28d9 30%, #a78bfa 50%, #c4b5fd 56%, transparent 72%)",
              }}
            />
          </div>

          {/* Input surface sits on top, covering the center */}
          <div className="relative bg-surface rounded-[14px] flex items-center gap-3 px-5 py-4">
            <SparkleIcon
              className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                loading ? "text-accent animate-pulse" : "text-accent"
              }`}
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask about William's work…"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted outline-none text-base"
            />
            <AnimatePresence>
              {query && !loading && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleSearch()}
                  className="text-sm font-mono text-muted hover:text-accent transition-colors"
                >
                  ↵
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Panel below input ── */}
        <AnimatePresence mode="wait">
          {loading && !response && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="mt-2 rounded-2xl bg-surface border border-border px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <SparkleIcon className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-xs font-mono tracking-widest text-muted uppercase">
                  Thinking…
                </span>
              </div>
            </motion.div>
          )}

          {response && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl bg-surface border border-border px-6 py-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <SparkleIcon className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono tracking-widest text-muted uppercase">
                  Gemini
                </span>
                {loading && (
                  <span className="inline-block w-1.5 h-4 bg-accent animate-pulse rounded-sm ml-0.5" />
                )}
              </div>
              <p className="text-foreground leading-relaxed">{response}</p>
              {!loading && (
                <button
                  onClick={handleReset}
                  className="mt-4 text-xs text-muted hover:text-accent font-mono transition-colors"
                >
                  Ask another →
                </button>
              )}
            </motion.div>
          )}

          {!loading && !response && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-2 rounded-2xl bg-surface border border-border px-4 py-3"
            >
              <p className="text-xs font-mono tracking-widest text-muted uppercase mb-2 px-2">
                Suggestions
              </p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-background transition-colors duration-150"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10.9 2.1l1.1 5.6 5.6 1.1-5.6 1.1-1.1 5.6-1.1-5.6L4.2 8.8l5.6-1.1L10.9 2.1zM4 16l.8 3.2L8 20l-3.2.8L4 24l-.8-3.2L0 20l3.2-.8L4 16zM18 0l.9 3.7 3.7.9-3.7.9L18 9l-.9-3.5-3.7-.9 3.7-.9L18 0z" />
    </svg>
  );
}