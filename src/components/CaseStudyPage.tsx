"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects, type ProjectFull } from "@/data/projects";

export default function CaseStudyPage({ project }: { project: ProjectFull }) {
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="relative">
      <Hero project={project} />
      {project.image && <Screenshot project={project} />}
      <Body project={project} />
      <ProjectNav prev={prev} next={next} />
    </main>
  );
}

function Hero({ project }: { project: ProjectFull }) {
  return (
    <section className="relative h-screen flex flex-col justify-end overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

      <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none">
        <svg className="w-full h-full">
          <filter id="grain-hero">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-hero)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-24 left-6 lg:left-12 z-10"
      >
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-mono tracking-widest uppercase transition-colors duration-300"
        >
          <span>←</span>
          <span>Work</span>
        </Link>
      </motion.div>

      <div className="relative z-10 px-6 lg:px-12 pb-16 lg:pb-24 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="text-xs uppercase tracking-widest font-mono backdrop-blur-sm bg-black/20 text-white/90 px-3 py-1 rounded-full border border-white/20">
            {project.tag}
          </span>
          <span className="font-mono text-sm text-white/60">{project.year}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-7xl md:text-[10rem] lg:text-[13rem] leading-none text-white mb-6"
        >
          {project.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed"
        >
          {project.description}
        </motion.p>

        {project.url && (
          <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileHover={{ scale: 1.03 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm text-white/90 hover:text-white hover:border-white/60 text-sm font-mono transition-colors duration-300"
          >
            <GlobeIcon className="w-4 h-4" />
            {project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </motion.a>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 right-8 z-10 flex flex-col items-center gap-3 text-xs text-white/50 tracking-widest"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-linear-to-b from-white/50 to-transparent"
        />
        <span>SCROLL</span>
      </motion.div>
    </section>
  );
}

function Screenshot({ project }: { project: ProjectFull }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const width = useTransform(scrollYProgress, [0, 1], ["70%", "100%"]);
  const radius = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <section ref={ref} className="relative bg-background py-24">
      <motion.div
        style={{ width, borderRadius: radius }}
        className="relative mx-auto aspect-video overflow-hidden border border-border"
      >
        <Image
          src={project.image!}
          alt={`${project.title} website screenshot`}
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </motion.div>
    </section>
  );
}

function Body({ project }: { project: ProjectFull }) {
  return (
    <section className="bg-background relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-32">
        <Overview project={project} />
        <ProcessSections project={project} />
        <Metrics project={project} />
      </div>
    </section>
  );
}

function Overview({ project }: { project: ProjectFull }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 pb-32 border-b border-border">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-sm tracking-[0.3em] uppercase text-muted font-mono mb-4">
          Overview
        </p>
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
          The <span className="text-gradient italic">Challenge</span>
        </h2>
        <p className="text-muted leading-relaxed text-lg">{project.overview}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="flex flex-col gap-8"
      >
        <div className="rounded-2xl border border-border bg-surface p-8 space-y-8">
          <Detail label="Role" value={project.role} />
          <Detail label="Timeline" value={project.timeline} />
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted font-mono mb-3">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-3 py-1 rounded-full border border-border text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs tracking-[0.3em] uppercase text-muted font-mono mb-1">
        {label}
      </p>
      <p className="text-foreground text-lg">{value}</p>
    </div>
  );
}

function ProcessSections({ project }: { project: ProjectFull }) {
  return (
    <div className="mb-32 space-y-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm tracking-[0.3em] uppercase text-muted font-mono mb-4">
          Process
        </p>
        <h2 className="font-display text-4xl md:text-5xl leading-tight">
          How it was <span className="text-gradient italic">built</span>
        </h2>
      </motion.div>

      {project.sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start"
        >
          <div>
            <span className="font-mono text-xs text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl md:text-3xl mt-2 leading-snug">
              {section.title}
            </h3>
          </div>
          <div>
            <p className="text-muted leading-relaxed text-lg">{section.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Metrics({ project }: { project: ProjectFull }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-sm tracking-[0.3em] uppercase text-muted font-mono mb-4">
        Results
      </p>
      <h2 className="font-display text-4xl md:text-5xl mb-16 leading-tight">
        By the <span className="text-gradient italic">numbers</span>
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
        {project.metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-surface p-8 flex flex-col gap-2"
          >
            <span className="font-display text-5xl md:text-6xl text-gradient">
              {metric.value}
            </span>
            <span className="text-sm text-muted leading-snug">{metric.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectNav({
  prev,
  next,
}: {
  prev: ProjectFull | null;
  next: ProjectFull | null;
}) {
  return (
    <nav className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2">
        {prev ? (
          <Link
            href={`/work/${prev.slug}`}
            className="group py-8 pr-4 md:py-12 md:pr-8 border-r border-border flex flex-col gap-2 hover:bg-surface transition-colors duration-300 min-w-0"
          >
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted group-hover:text-accent transition-colors duration-300">
              ← Previous
            </span>
            <span className="font-display text-xl sm:text-2xl md:text-4xl break-words">{prev.title}</span>
            <span className="text-sm text-muted font-mono">{prev.tag}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="group py-8 pl-4 md:py-12 md:pl-8 flex flex-col gap-2 items-end text-right hover:bg-surface transition-colors duration-300 min-w-0"
          >
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-muted group-hover:text-accent transition-colors duration-300">
              Next →
            </span>
            <span className="font-display text-xl sm:text-2xl md:text-4xl break-words">{next.title}</span>
            <span className="text-sm text-muted font-mono">{next.tag}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.75 5.5 3.75 9s-1.25 6.5-3.75 9c-2.5-2.5-3.75-5.5-3.75-9S9.5 5.5 12 3z" />
    </svg>
  );
}