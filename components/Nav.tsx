"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} aria-label="Primary">
      <a className="mark" href="#top">William Wu<span>.</span></a>
      <div className="links">
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#work">Work</a>
        <a href="#stack">Stack</a>
        <a href="#contact">Contact</a>
      </div>
      <a className="hello" href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
    </nav>
  );
}
