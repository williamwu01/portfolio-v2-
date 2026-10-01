import Scene from "@/components/Scene";
import Nav from "@/components/Nav";
import Dock from "@/components/Dock";
import Clock from "@/components/Clock";
import CopyEmail from "@/components/CopyEmail";
import ProjectBubbles from "@/components/ProjectBubbles";
import { profile, stats, experience, stack } from "@/lib/content";

const letters = (word: string, start = 0) =>
  word.split("").map((ch, i) => (
    <span key={i} style={{ animationDelay: `${0.05 + (start + i) * 0.05}s` }}>{ch}</span>
  ));

export default function Home() {
  return (
    <>
      <Scene />
      <div className="veil" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <Dock />

      <main>
        {/* ---------------- HERO ---------------- */}
        <header className="hero wrap" id="top">
          <div className="copy">
            <p className="eyebrow"><i />{profile.tagline}</p>
            <h1 aria-label={profile.name}>
              <span className="word">{letters("William")}</span>
              <span className="word">{letters("Wu", 7)}</span>
            </h1>
            <div className="row">
              <p className="lede">{profile.intro}</p>
              <div className="cta">
                <a className="btn primary" href="#work">
                  See my work
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 1v12M1.5 7.5 7 13l5.5-5.5" /></svg>
                </a>
                <a className="btn ghost" href="#contact">Get in touch</a>
              </div>
            </div>
          </div>
          <div className="hud">
            <span>{profile.coords}</span>
            <span>Local <Clock /></span>
            <span>Est. {profile.established}</span>
            <span className="scroll-cue">Scroll to dive <i aria-hidden="true" /></span>
          </div>
        </header>

        {/* ---------------- ABOUT ---------------- */}
        <section id="about" className="sec wrap" aria-labelledby="about-title">
          <div className="panel left">
            <p className="eyebrow"><i />About</p>
            <h2 id="about-title">Polished, fast, and a&nbsp;little bit alive.</h2>
            {profile.bio.map((p) => <p key={p} className="body">{p}</p>)}
            <dl className="stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------- EXPERIENCE ---------------- */}
        <section id="experience" className="sec wrap" aria-labelledby="exp-title">
          <div className="panel right wide">
            <p className="eyebrow"><i />Experience</p>
            <h2 id="exp-title">Where I&rsquo;ve worked</h2>
            <ol className="timeline">
              {experience.map((job) => (
                <li key={job.company}>
                  <div className="when">{job.dates}</div>
                  <div>
                    <h3>{job.role}</h3>
                    <p className="org">{job.company}</p>
                    <ul>
                      {job.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- WORK (bubbles) ---------------- */}
        <ProjectBubbles />

        {/* ---------------- STACK ---------------- */}
        <section id="stack" className="sec wrap" aria-labelledby="stack-title">
          <div className="panel left wide">
            <p className="eyebrow"><i />Stack</p>
            <h2 id="stack-title">What I build with</h2>
            <dl className="stack">
              {stack.map((g) => (
                <div key={g.group}>
                  <dt>{g.group}</dt>
                  <dd>{g.items.map((it) => <span key={it} className="chip">{it}</span>)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section id="contact" className="sec wrap contact" aria-labelledby="contact-title">
          <div className="panel center">
            <p className="eyebrow"><i />Contact</p>
            <h2 id="contact-title" className="big">Let&rsquo;s build something.</h2>
            <p className="body">Open to full-time roles and freelance projects in Vancouver or remote.</p>
            <CopyEmail email={profile.email} />
            <div className="socials">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF) ↗</a>
            </div>
          </div>
          <footer className="foot">
            <span>© 2026 William Wu</span>
            <span>Built with Next.js, Three.js and lots of coffee</span>
          </footer>
        </section>
      </main>
    </>
  );
}
