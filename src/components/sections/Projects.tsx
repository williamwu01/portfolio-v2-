"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";

type Project = {
  slug: string;
  title: string;
  tag: string;
  description: string;
  gradient: string;
  image?: string;
  year: string;
};

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(projects.length - 1) * 50}vw`],
  );
  const xClamped = useTransform(x, (v) => {
    const max = -(projects.length - 1) * (typeof window !== "undefined" ? window.innerWidth - 480 : 0);
    const num = parseFloat(v.toString());
    return num + "%";
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute top-12 left-0 right-0 z-10 px-6 lg:px-12 flex justify-between items-end">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-muted mb-2">
              Selected Work
            </p>
            <h2 className="font-display text-5xl md:text-7xl">
              Things I&rsquo;ve <span className="italic text-gradient">made</span>
            </h2>
          </div>
          <p className="hidden md:block text-xs text-muted font-mono">
            scroll →
          </p>
        </div>

        <motion.div style={{ x }} className="flex gap-8 pl-[8vw] pt-32">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p as Project} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative w-[80vw] md:w-[60vw] lg:w-[50vw] flex-shrink-0"
    >
      <Link href={`/work/${project.slug}`} className="block">
        <div className="relative aspect-[4/5] md:aspect-[5/4] rounded-2xl overflow-hidden border border-border">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90`}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

          {project.image && (
            <>
              <Image
                src={project.image}
                alt={`${project.title} website screenshot`}
                fill
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) 60vw, 80vw"
                className="object-cover object-top opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-100" />
            </>
          )}

          <div className="absolute inset-0 mix-blend-overlay opacity-30">
            <svg className="w-full h-full">
              <filter id={`grain-${index}`}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="3"
                />
              </filter>
              <rect width="100%" height="100%" filter={`url(#grain-${index})`} />
            </svg>
          </div>

          <div className="absolute top-6 left-6 right-6 flex justify-between items-start text-white/90">
            <span className="text-xs uppercase tracking-widest font-mono backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
              {project.tag}
            </span>
            <span className="font-mono text-sm">{project.year}</span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h3 className="font-display text-5xl md:text-7xl mb-3 leading-none">
              {project.title}
            </h3>
            <p className="text-white/80 max-w-md leading-relaxed">
              {project.description}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300"
          >
            <span className="px-6 py-3 rounded-full border border-white/40 text-white text-sm tracking-widest uppercase backdrop-blur-md">
              View case study →
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.article>
  );
}
