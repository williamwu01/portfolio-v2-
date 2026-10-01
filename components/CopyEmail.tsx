"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.getElementById("email-text");
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const sel = getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
    }
  };
  return (
    <div className="email">
      <a id="email-text" href={`mailto:${email}`}>{email}</a>
      <button type="button" className="btn ghost small" onClick={copy}>{copied ? "Copied" : "Copy email"}</button>
    </div>
  );
}
