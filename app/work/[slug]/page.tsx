import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Scene from "@/components/Scene";
import CaseShot from "@/components/CaseShot";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — William Wu`,
    description: project.description,
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <Scene fixed={0.62} />
      <div className="veil" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <nav className="nav scrolled">
        <Link className="mark" href="/">
          William<span>.</span>
        </Link>
        <Link className="hello" href="/#work">
          ← All work
        </Link>
      </nav>

      <main>
        <header className="case-hero wrap">
          <p className="eyebrow">
            <i />
            {project.year} · {project.kind}
          </p>
          <h1 className="case-title">{project.name}</h1>
          <p className="lede">{project.description}</p>
          <div className="case-meta">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd className="case-chips">
                {project.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </div>
          {project.live && (
            <a className="btn primary" href={project.live.href} target="_blank" rel="noreferrer">
              Visit {project.live.label}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </header>

        {project.image && (
          <section className="sec wrap case-sec" aria-labelledby="shot-title">
            <div className="panel center wide case-shot">
              <p className="eyebrow">
                <i />
                Screenshot
              </p>
              <h2 id="shot-title">What it looks like</h2>
              <CaseShot
                src={project.image.src}
                width={project.image.width}
                height={project.image.height}
                alt={`Screenshot of the ${project.name} website`}
              />
            </div>
          </section>
        )}

        <section className="sec wrap case-sec" aria-labelledby="problem-title">
          <div className="panel left wide">
            <p className="eyebrow">
              <i />
              Problem
            </p>
            <h2 id="problem-title">What needed solving</h2>
            <p className="body">{project.problem}</p>
          </div>
        </section>

        <section className="sec wrap case-sec" aria-labelledby="approach-title">
          <div className="panel right wide">
            <p className="eyebrow">
              <i />
              Approach
            </p>
            <h2 id="approach-title">How it was built</h2>
            <ul className="case-list">
              {project.approach.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec wrap case-sec" aria-labelledby="results-title">
          <div className="panel left wide">
            <p className="eyebrow">
              <i />
              Results
            </p>
            <h2 id="results-title">Outcome</h2>
            <ul className="case-list">
              {project.results.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="case-foot wrap">
          <Link className="case-nav-link" href={`/work/${prev.slug}`}>
            <span aria-hidden="true">←</span> {prev.name}
          </Link>
          <Link className="btn ghost" href="/#work">
            All work
          </Link>
          <Link className="case-nav-link" href={`/work/${next.slug}`}>
            {next.name} <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </main>
    </>
  );
}
