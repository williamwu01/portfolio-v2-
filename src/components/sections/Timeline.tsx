"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type TimelineItem = {
  year: string;
  title: string;
  org: string;
  type: "work" | "education";
  description: string;
};

const items: TimelineItem[] = [
  {
    year: "Mar 2026 - Present",
    title: "Configuration Analyst",
    org: "Forward Insurance Managers Ltd.",
    type: "work",
    description:
      "Configuring insurance products in an enterprise platform: building form interfaces, complex custom calculations for premiums and liabilities, and testing REST API endpoints. Developed internal JavaScript tools to streamline configuration workflows.",
  },
  {
    year: "May 2025 - Mar 2026",
    title: "Project Manager | Lead Developer",
    org: "PulseHire AI",
    type: "work",
    description:
      "Led development of an AI interviewing job board built with Next.js, including a full admin dashboard and API integrations. Set up GA4/GTM analytics, boosted SEO, and managed workflow with Kanban boards and Gantt charts.",
  },
  {
    year: "May 2024 - Mar 2026",
    title: "Web Developer | UI/UX Designer",
    org: "Vancouver WebTeck",
    type: "work",
    description:
      "Developed responsive client websites end to end with React, Next.js, PHP, WordPress, and Shopify. Designed wireframes, prototypes, and site maps in Figma.",
  },
  {
    year: "Sep 2024 - May 2025",
    title: "Frontend Engineer",
    org: "Let's Pair Education",
    type: "work",
    description:
      "Built the matching algorithm in TypeScript, scalable data models with Prisma and PostgreSQL, and a cookie-based auth system in Next.js. Designed a responsive, user-friendly UI with Tailwind CSS.",
  },
  {
    year: "Jun 2024 - Sep 2024",
    title: "WordPress Developer",
    org: "Henesys Digital",
    type: "work",
    description:
      "Created custom shortcodes for contact info, banners, buttons, and card components. Optimized media and removed unused scripts and stylesheets to improve page speed.",
  },
];

function TimelineRow({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 40%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -40 : 40, 0],
  );

  const left = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-9 items-center py-12">
      <motion.div
        style={{ opacity, x: left ? x : undefined }}
        className={`col-span-4 ${left ? "text-right pr-8" : "col-start-6 pl-8"}`}
      >
        {left && <TimelineCard item={item} align="right" />}
      </motion.div>

      <div className="col-span-1 flex justify-center relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-30%" }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-4 h-4 rounded-full bg-accent ring-4 ring-background glow"
        />
      </div>

      <motion.div
        style={{ opacity, x: !left ? x : undefined }}
        className={`col-span-4 ${!left ? "pl-8" : "col-start-1 row-start-1 text-right pr-8 invisible"}`}
      >
        {!left && <TimelineCard item={item} align="left" />}
      </motion.div>
    </div>
  );
}

function TimelineCard({
  item,
  align,
}: {
  item: TimelineItem;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "ml-auto max-w-md" : "max-w-md"}>
      <div className="flex items-center gap-3 mb-2 text-xs uppercase tracking-widest text-muted"
        style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
      >
        <span className="font-mono text-accent-2">{item.year}</span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span>{item.type}</span>
      </div>
      <h3 className="font-display text-3xl md:text-4xl mb-1">{item.title}</h3>
      <p className="text-accent mb-3 font-mono text-sm">{item.org}</p>
      <p className="text-muted leading-relaxed">{item.description}</p>
    </div>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section id="timeline" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted mb-4">
            The Path
          </p>
          <h2 className="font-display text-6xl md:text-8xl">
            Where I&rsquo;ve <span className="italic text-gradient">been</span>
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" />
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent-2 to-transparent origin-top"
          />

          {items.map((item, i) => (
            <TimelineRow key={item.year + item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
