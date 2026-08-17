"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const [shape, setShape] = useState("Sphere");
  const [isTouch, setIsTouch] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(true);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!isTouch) return;
    function hideHint() {
      setShowGestureHint(false);
      window.removeEventListener("scroll", hideHint);
    }
    window.addEventListener("scroll", hideHint, { passive: true });
    return () => window.removeEventListener("scroll", hideHint);
  }, [isTouch]);

  const handleInteract = useCallback(() => setShowGestureHint(false), []);

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 z-0">
        <HeroScene onShapeChange={setShape} onInteract={handleInteract} />
      </div>

      <div className="absolute inset-0 z-10 bg-linear-to-b from-background/0 via-background/0 to-background pointer-events-none" />

      <div className="relative z-20 text-center px-6 pointer-events-none select-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm tracking-[0.3em] uppercase text-muted mb-6"
        >
          Web Developer · Designer · Tinkerer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-display text-7xl md:text-9xl lg:text-[12rem] leading-none tracking-tight"
        >
          William <span className="text-gradient italic mx-2">Wu</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-lg md:text-xl text-muted max-w-2xl mx-auto"
        >
          I build interactive, performant web experiences at the intersection
          of design and engineering.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-24 right-8 z-20 pointer-events-none"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-muted/60">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.span
              key={shape}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
            >
              {shape}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-xs text-muted tracking-widest pointer-events-none"
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-linear-to-b from-muted to-transparent"
        />
      </motion.div>

      {isTouch && (
        <AnimatePresence>
          {showGestureHint && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, delay: 1.2 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/80 backdrop-blur-sm text-xs text-muted pointer-events-none"
            >
              <TwoFingerSwipeIcon className="w-4 h-4" />
              <span>Two-finger swipe to rotate</span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}

function TwoFingerSwipeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="9" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M4.5 9L2 12l2.5 3" />
      <path d="M19.5 9L22 12l-2.5 3" />
    </svg>
  );
}
