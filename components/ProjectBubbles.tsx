"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { projects } from "@/lib/content";

/**
 * Pinned, scroll-driven carousel. While the section is pinned, scrolling moves
 * projects from right to left: each bubble floats in small from the right,
 * swells into focus in the centre, then rises and pops off to the left.
 */
export default function ProjectBubbles() {
  const sectionRef = useRef<HTMLElement>(null);
  const bubbleRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const N = projects.length;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, f = 0, lastActive = -1;
    const t0 = performance.now();

    const progress = () => {
      const top = section.getBoundingClientRect().top;
      const run = Math.max(1, section.offsetHeight - innerHeight);
      return Math.min(1, Math.max(0, -top / run));
    };
    f = progress() * (N - 1);

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const target = progress() * (N - 1);
      f += reduced ? target - f : (target - f) * 0.12;
      const spacing = Math.min(innerWidth * 0.55, 640);
      const mobile = innerWidth < 700;

      bubbleRefs.current.forEach((el, i) => {
        if (!el) return;
        const o = i - f;
        let x = o * spacing, y = 0, sc = 1, op = 1, rot = 0;
        if (o >= 0) {
          // waiting on the right: small, low, faint
          sc = 1 - Math.min(o, 2) * (mobile ? 0.42 : 0.34);
          y = o * 50;
          op = Math.max(0, Math.min(1, 1.5 - o * 0.85));
          if (mobile) x = o * spacing * 1.25;
        } else {
          // leaving to the left: rise, swell, pop
          const e = -o;
          y = -e * 170;
          sc = 1 + e * 0.16;
          op = Math.max(0, 1 - e * 1.7);
          x = o * spacing * 0.8;
        }
        if (!reduced) {
          y += Math.sin(t * 0.9 + i * 1.7) * 10;
          x += Math.cos(t * 0.6 + i * 2.3) * 6;
          rot = Math.sin(t * 0.5 + i) * 2 - o * 4;
        }
        el.style.display = op <= 0.002 ? "none" : "";
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${sc.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(100 - Math.round(Math.abs(o) * 10));
        const focus = Math.abs(o) < 0.5;
        if (el.inert === focus) el.inert = !focus;
        if (el.dataset.focus !== String(focus)) el.dataset.focus = focus ? "true" : "false";
      });

      const a = Math.round(f);
      if (a !== lastActive) { lastActive = a; setActive(a); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [N]);

  const goTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const idx = Math.max(0, Math.min(N - 1, i));
    const top = section.getBoundingClientRect().top + scrollY;
    const run = section.offsetHeight - innerHeight;
    scrollTo({ top: top + (idx / (N - 1)) * run + 2, behavior: "smooth" });
  };

  return (
    <section id="work" ref={sectionRef} className="work-pin" style={{ height: `${N * 75 + 100}svh` }} aria-labelledby="work-title">
      <div className="pin">
        <header className="pin-head wrap">
          <div>
            <p className="eyebrow"><i />Selected work</p>
            <h2 id="work-title">Things I&rsquo;ve shipped</h2>
          </div>
          <div className="pin-ctrl">
            <span className="count" aria-live="polite">
              <b>{String(active + 1).padStart(2, "0")}</b> / {String(N).padStart(2, "0")}
            </span>
            <button type="button" className="round" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <button type="button" className="round" onClick={() => goTo(active + 1)} disabled={active === N - 1} aria-label="Next project">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </div>
        </header>

        <div className="bubbles">
          {projects.map((pr, i) => (
            <article
              key={pr.name}
              ref={(el) => { bubbleRefs.current[i] = el; }}
              className="bubble"
              style={{ ["--hue" as string]: pr.hue, ["--d" as string]: `${i * -1.7}s` }}
              aria-label={`${pr.name}, ${pr.kind}, ${pr.year}`}
            >
              <div className="b-inner">
                <p className="b-meta">{pr.year} · {pr.kind}</p>
                <h3>{pr.name}</h3>
                <p className="b-desc">{pr.description}</p>
                <div className="b-links">
                  <Link href={`/work/${pr.slug}`}>Case study</Link>
                  {pr.live && <a href={pr.live.href} target="_blank" rel="noreferrer">{pr.live.label} <span aria-hidden="true">↗︎</span></a>}
                </div>
              </div>
            </article>
          ))}
        </div>

        <nav className="dots" aria-label="Projects">
          {projects.map((pr, i) => (
            <button key={pr.name} type="button" aria-label={pr.name} aria-current={i === active ? "true" : undefined} onClick={() => goTo(i)} />
          ))}
        </nav>
      </div>
    </section>
  );
}
