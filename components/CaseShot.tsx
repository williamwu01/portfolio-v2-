"use client";

import { useState } from "react";

export default function CaseShot({
  src,
  width,
  height,
  alt,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="case-shot-wrap">
      <div className={`case-shot-frame${open ? " open" : ""}`}>
        <img src={src} width={width} height={height} alt={alt} loading="lazy" />
        {!open && <div className="case-shot-fade" aria-hidden="true" />}
        {!open && (
          <button type="button" className="case-shot-toggle" onClick={() => setOpen(true)}>
            View full page <span aria-hidden="true">↓</span>
          </button>
        )}
      </div>
      {open && (
        <button type="button" className="btn ghost small" onClick={() => setOpen(false)}>
          Show less <span aria-hidden="true">↑</span>
        </button>
      )}
    </div>
  );
}
