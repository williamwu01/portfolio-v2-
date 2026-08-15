"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const blobY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
    >
      <motion.div
        style={{ y: blobY }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-[120px] animate-blob"
      />
      <motion.div
        style={{ y: blobY }}
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent-2/20 blur-[120px] animate-blob"
      />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative">
        <div className="max-w-md">
          <motion.div style={{ y }} className="relative aspect-[3/4]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent via-accent-2 to-pink-400 blur-2xl opacity-40" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-accent-2/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-9xl text-foreground/20">
                  W
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between text-xs font-mono text-muted">
                <span>est. 1995</span>
                <span>// Vancouver, BC</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={() =>
              window.dispatchEvent(new Event("open-ai-search"))
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm hover:border-accent hover:text-accent transition-all duration-300"
          >
            <SparkleIcon className="w-4 h-4" />
            Ask AI about me
          </motion.button>
        </div>

        <div>
          <p className="text-sm tracking-[0.3em] uppercase text-muted mb-4">
            About
          </p>
          <h2 className="font-display text-5xl md:text-7xl mb-8 leading-tight">
            A developer who <span className="italic text-gradient">cares</span>{" "}
            about the details.
          </h2>
          <div className="space-y-5 text-lg text-muted leading-relaxed">
            <p>
              I&rsquo;m William, a web developer based in Vancouver. I love
              shipping things on the web that feel polished, fast, and a little
              bit alive.
            </p>
            <p>
              I split my time between writing TypeScript and obsessing over
              easing curves. I&rsquo;ve worked across startups and studios on
              everything from design systems to real-time collaboration tools
              to the occasional generative art experiment.
            </p>
            <p>
              When I&rsquo;m not in front of a screen, you&rsquo;ll find me in
              the gym lifting weights. I&rsquo;m also deep into researching
              and learning about AI, and I&rsquo;m always tinkering on side
              projects.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: "Years building", value: "3+" },
              { label: "Gym sessions / wk", value: "5" },
              { label: "Coffees / day", value: "3" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
