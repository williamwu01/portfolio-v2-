"use client";

import { motion } from "framer-motion";

const stack = [
  { name: "TypeScript", category: "Language" },
  { name: "React", category: "Framework" },
  { name: "Next.js", category: "Framework" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "GSAP", category: "Animation" },
  { name: "Three.js", category: "3D / WebGL" },
  { name: "GLSL", category: "Shaders" },
  { name: "Node.js", category: "Runtime" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Figma", category: "Design" },
  { name: "Vercel", category: "Platform" },
];

const marqueeWords = [
  "TypeScript",
  "React",
  "Next.js",
  "Three.js",
  "GLSL",
  "Tailwind",
  "Framer",
  "GSAP",
  "Node",
  "Postgres",
];

export default function TechStack() {
  return (
    <section id="stack" className="relative py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted mb-4">
            Toolkit
          </p>
          <h2 className="font-display text-5xl md:text-7xl mb-4">
            What I reach <span className="italic text-gradient">for</span>
          </h2>
          <p className="text-muted max-w-xl text-lg">
            A pragmatic stack — the boring bits where they belong, the fun bits
            for the parts that matter.
          </p>
        </motion.div>
      </div>

      <div className="relative mb-16">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap py-4 border-y border-border">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span
              key={i}
              className="font-display text-7xl md:text-9xl px-12 text-foreground/10"
            >
              {word} <span className="text-accent/40">/</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {stack.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ y: -4, borderColor: "var(--accent)" }}
              className="group p-5 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-all"
            >
              <div className="text-xs uppercase tracking-widest text-muted mb-2 font-mono">
                {item.category}
              </div>
              <div className="font-display text-2xl group-hover:text-gradient transition-colors">
                {item.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
