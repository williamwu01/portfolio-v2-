"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import AISearch from "@/components/AISearch";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#timeline", label: "Journey" },
  { href: "#projects", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [0, 12]);
  const bg = useTransform(scrollY, [0, 100], ["rgba(8,8,11,0)", "rgba(8,8,11,0.7)"]);

  useEffect(() => {
    const openSearch = () => setSearchOpen(true);
    window.addEventListener("open-ai-search", openSearch);
    return () => window.removeEventListener("open-ai-search", openSearch);
  }, []);

  return (
    <>
      <motion.nav
        style={{
          backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
          backgroundColor: bg,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <a href="#hero" className="font-display text-2xl tracking-tight">
            W<span className="text-gradient">.</span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm text-muted">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="AI Search"
              className="relative w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-accent transition-colors duration-300 group"
            >
              <SparkleIcon className="w-4 h-4 text-muted group-hover:text-accent transition-colors duration-300" />
            </motion.button>
            <a
              href="#contact"
              className="hidden md:inline-flex px-4 py-2 rounded-full border border-border text-sm hover:border-accent hover:text-accent transition-all duration-300"
            >
              Let&rsquo;s talk
            </a>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {searchOpen && <AISearch onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
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
