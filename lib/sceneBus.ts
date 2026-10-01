// Tiny shared store so UI (mood buttons) and the WebGL scene can talk without re-rendering React each frame.
export type Mood = "golden" | "blue" | "night";

export const MOOD_META: Record<Mood, { label: string; accent: string }> = {
  golden: { label: "Golden hour", accent: "#F2B06B" },
  blue: { label: "Blue hour", accent: "#B9A6E8" },
  night: { label: "Night", accent: "#9CC2E6" },
};

let mood: Mood = "golden";
const listeners = new Set<() => void>();

export const moodStore = {
  get: () => mood,
  set(next: Mood) {
    if (next === mood) return;
    mood = next;
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent", MOOD_META[next].accent);
    }
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
