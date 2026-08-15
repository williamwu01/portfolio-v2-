import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Timeline />
      <Projects />
      <About />
      <TechStack />
      <Contact />
    </main>
  );
}
