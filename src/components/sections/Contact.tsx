"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const socials = [
  { label: "GitHub", href: "https://github.com/williamwu01" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/williamwu01/" },
  { label: "Resume", href: "/William_Wu_Resume.pdf" },
];

export default function Contact() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-between py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.15),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted mb-6">
            Let&rsquo;s build something
          </p>
          <h2 className="font-display text-7xl md:text-9xl lg:text-[11rem] leading-[0.9] tracking-tight">
            Say <span className="italic text-gradient">hello</span>.
          </h2>
        </motion.div>

        <motion.a
          href="mailto:williamwuu3@gmail.com"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="block max-w-3xl mx-auto p-8 rounded-2xl border border-border bg-surface/50 hover:border-accent transition-all duration-500 group"
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted mb-2">
                Email me
              </div>
              <div className="font-display text-3xl md:text-5xl text-foreground group-hover:text-gradient transition-colors">
                williamwuu3@gmail.com
              </div>
            </div>
            <motion.div
              whileHover={{ rotate: 45, scale: 1.1 }}
              className="hidden md:flex w-16 h-16 rounded-full bg-accent text-background items-center justify-center text-2xl flex-shrink-0"
            >
              →
            </motion.div>
          </div>
        </motion.a>

        <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-4">
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onHoverStart={() => setHovered(s.label)}
              onHoverEnd={() => setHovered(null)}
              className="relative font-display text-3xl md:text-4xl text-muted hover:text-foreground transition-colors"
            >
              {s.label}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-px bg-accent origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hovered === s.label ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="ml-2 text-accent inline-block"
                animate={{
                  x: hovered === s.label ? 4 : 0,
                  opacity: hovered === s.label ? 1 : 0.4,
                }}
              >
                ↗
              </motion.span>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto w-full mt-32 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs font-mono text-muted">
        <span>© {new Date().getFullYear()} William Wu. All rights reserved.</span>
        <span>Built with Next.js + Three.js + lots of coffee.</span>
      </div>
    </section>
  );
}
