"use client";

import { useSyncExternalStore } from "react";
import { moodStore, MOOD_META, type Mood } from "@/lib/sceneBus";

/** Fixed corner instrument: live altitude/depth (written by <Scene/>) and the lighting switch. */
export default function Dock() {
  const mood = useSyncExternalStore(moodStore.subscribe, moodStore.get, () => "golden" as Mood);
  return (
    <aside className="dock" aria-label="Scene controls">
      <div className="gauge">
        <span id="depth-label">Altitude</span>
        <b id="depth-readout">+17.0 m</b>
      </div>
      <div className="moods" role="group" aria-label="Lighting">
        {(Object.keys(MOOD_META) as Mood[]).map((m) => (
          <button key={m} id={`mood-${m}`} type="button" aria-pressed={mood === m} onClick={() => moodStore.set(m)}>
            {m === "golden" ? "Golden" : m === "blue" ? "Blue hour" : "Night"}
          </button>
        ))}
      </div>
    </aside>
  );
}
