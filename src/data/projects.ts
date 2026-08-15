export type Section = {
  title: string;
  body: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type ProjectFull = {
  slug: string;
  title: string;
  tag: string;
  description: string;
  gradient: string;
  image?: string;
  url?: string;
  year: string;
  role: string;
  timeline: string;
  stack: string[];
  overview: string;
  sections: Section[];
  metrics: Metric[];
};

export const projects: ProjectFull[] = [
  {
    slug: "ridelink",
    title: "RideLink",
    tag: "Booking Platform",
    description:
      "Ride booking platform for Vancouver with SMS-powered booking and notifications. Live at ridelinkyvr.com.",
    gradient: "from-violet-500 via-fuchsia-500 to-rose-400",
    image: "/projects/ridelink.png",
    url: "https://ridelinkyvr.com/",
    year: "2026",
    role: "Solo Developer",
    timeline: "2026",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Twilio", "Vercel"],
    overview:
      "RideLink is a ride booking platform serving the Vancouver area, live at ridelinkyvr.com. The goal was to make booking a ride as frictionless as sending a text: customers book through the site, and every confirmation, reminder, and update arrives instantly through Twilio-powered SMS.",
    sections: [
      {
        title: "SMS-First Communication with Twilio",
        body: "Twilio handles the entire communication layer: booking confirmations, ride reminders, and status updates all flow through SMS. Handling Twilio webhooks server-side in Next.js API routes keeps the booking state in sync with what customers see on their phones, so a rider never has to open the site to know their booking went through.",
      },
      {
        title: "Supabase as the Backbone",
        body: "All booking, customer, and scheduling data lives in Supabase (PostgreSQL). Supabase's client libraries and row-level security made it possible to ship a secure data layer quickly without maintaining a separate backend, and its realtime features keep the admin view current as new bookings land.",
      },
      {
        title: "Shipping Fast on Vercel",
        body: "The site is built with Next.js and TypeScript and deployed on Vercel. Server-side rendering keeps the public pages fast and SEO-friendly for local search, while the same codebase hosts the API routes that process bookings and talk to Twilio.",
      },
    ],
    metrics: [
      { value: "SMS", label: "booking confirmations via Twilio" },
      { value: "24/7", label: "automated booking flow" },
      { value: "50+", label: "rides/month during FIFA rush" },
      { value: "Live", label: "at ridelinkyvr.com" },
    ],
  },
  {
    slug: "shar-lab",
    title: "Shars Hair Lab",
    tag: "WordPress · Booking",
    description:
      "Custom WordPress booking site for a hair salon, with a custom theme and plugin powering Square-integrated payments and scheduling.",
    gradient: "from-pink-400 via-purple-500 to-indigo-500",
    image: "/projects/shar-lab.png",
    url: "https://sharshairlab.com/",
    year: "2026",
    role: "Web Developer",
    timeline: "2026",
    stack: ["WordPress", "PHP", "Custom Theme", "Custom Plugin", "Square API"],
    overview:
      "Shars Hair Lab needed an online booking experience built around how the salon actually runs: services, availability, and payments all in one flow. I built a custom WordPress theme and a custom plugin from scratch to handle bookings, backed by Square for payment processing and scheduling.",
    sections: [
      {
        title: "A Custom Theme and Booking Plugin",
        body: "Rather than bolting a generic booking plugin onto a template, I built a custom WordPress theme matched to the salon's brand and a custom plugin to manage services, staff, and availability, giving full control over the booking flow end to end.",
      },
      {
        title: "Square for Payments and Scheduling",
        body: "The booking plugin integrates directly with the Square API, handling service selection, scheduling, and payment in a single checkout so appointments and transactions stay in sync automatically without manual reconciliation.",
      },
    ],
    metrics: [
      { value: "30+", label: "bookings per month" },
      { value: "Square", label: "API for payments & scheduling" },
      { value: "Custom", label: "WordPress theme & plugin" },
      { value: "PHP", label: "backend built from scratch" },
    ],
  },
  {
    slug: "pulsehire",
    title: "PulseHire AI",
    tag: "AI · Job Board",
    description:
      "AI interviewing job board built with Next.js, with a full admin dashboard, API integrations, and GA4/GTM analytics.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    image: "/projects/pulsehire.png",
    url: "https://pulsehire.ai/",
    year: "2025",
    role: "Project Manager | Lead Developer",
    timeline: "May 2025 - Mar 2026",
    stack: ["Next.js", "TypeScript", "GA4", "Google Tag Manager", "Figma"],
    overview:
      "PulseHire AI is an AI interviewing job board based in Surrey, BC. As project manager and lead developer, I owned the product from Figma prototypes through production: the candidate-facing job board, the admin dashboard that runs it, and the analytics that measure it.",
    sections: [
      {
        title: "The Job Board and API Integrations",
        body: "The core product is a Next.js job board integrated with AI interviewing APIs, letting candidates apply and complete AI-driven interviews in one flow. Building it in Next.js kept the public pages fast and SEO-friendly, which mattered for a product that lives or dies by organic job-seeker traffic.",
      },
      {
        title: "An Admin Dashboard That Runs the Business",
        body: "Behind the job board sits a robust admin dashboard for managing the applications flowing through the platform: reviewing candidates, managing postings, and keeping the pipeline moving. It was designed and prototyped in Figma alongside the main site so the two always felt like one product.",
      },
      {
        title: "Analytics, SEO, and Process",
        body: "I set up GA4 and Google Tag Manager to track site visits and conversion, and applied SEO and performance best practices to grow organic reach. On the process side, I created detailed timelines and managed the team's workflow with Kanban boards and Gantt charts, and migrated legacy WordPress and Wix sites into the new stack for flexibility.",
      },
    ],
    metrics: [
      { value: "11 mo", label: "from kickoff to handoff" },
      { value: "GA4", label: "analytics and GTM from day one" },
      { value: "2", label: "products shipped: job board + admin" },
      { value: "SEO", label: "best practices baked in" },
    ],
  },
  {
    slug: "webteck",
    title: "Vancouver WebTeck",
    tag: "Client Work · Agency",
    description:
      "Responsive client websites built end to end with React, Next.js, WordPress, and Shopify, designed in Figma.",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    image: "/projects/webteck.png",
    url: "https://webteck.ca/",
    year: "2024",
    role: "Web Developer | UI/UX Designer",
    timeline: "May 2024 - Mar 2026",
    stack: ["React", "Next.js", "PHP", "WordPress", "Shopify", "Figma", "Tailwind CSS"],
    overview:
      "At Vancouver WebTeck I built dynamic, responsive client websites end to end: front-end and back-end development, CMS builds, and the design work that came before any code. Every project balanced performance, accessibility, and the client's brand.",
    sections: [
      {
        title: "End-to-End Builds",
        body: "Projects spanned modern stacks (React, Next.js, Tailwind CSS) and CMS platforms (WordPress, Shopify, PHP), chosen per client based on what they could maintain after handoff. The constant across all of them was performance, accessibility, and clean, scalable code.",
      },
      {
        title: "Design Before Development",
        body: "I designed wireframes and prototypes in Figma for every client project, along with site maps and color boards matched to each brand. Starting in design meant clients signed off on the experience before development started, which kept builds fast and revisions small.",
      },
    ],
    metrics: [
      { value: "2 yrs", label: "of client projects" },
      { value: "5+", label: "platforms: React, Next.js, PHP, WordPress, Shopify" },
      { value: "Figma", label: "wireframes to prototypes to build" },
      { value: "100%", label: "responsive, accessible delivery" },
    ],
  },
  {
    slug: "taskbuddy",
    title: "TaskBuddy",
    tag: "Personal Tool",
    description:
      "A personal task management app built in vanilla JavaScript for organizing work and staying on top of what matters.",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    year: "2026",
    role: "Solo Developer",
    timeline: "2026",
    stack: ["JavaScript", "HTML", "CSS"],
    overview:
      "TaskBuddy is a personal task management app I built for my own day-to-day organization: capture tasks quickly, group them into projects, and see at a glance what needs attention next. It's not launched publicly — I use it myself.",
    sections: [
      {
        title: "Designed Around Quick Capture",
        body: "The core loop of any task app is capture, organize, complete. TaskBuddy keeps the capture step as close to zero friction as possible so tasks actually make it into the system instead of living in my head.",
      },
      {
        title: "Built with Vanilla JavaScript",
        body: "The app is built from scratch in vanilla JavaScript, HTML, and CSS with no framework, which kept it lightweight and let me move fast on a tool that's just for personal use.",
      },
    ],
    metrics: [
      { value: "Dev", label: "tool, not publicly launched" },
      { value: "JS", label: "vanilla, no framework" },
      { value: "0", label: "friction task capture" },
      { value: "1", label: "place for everything" },
    ],
  },
  {
    slug: "letspair",
    title: "Let's Pair",
    tag: "EdTech · Mentorship",
    description:
      "1-on-1 React and Node.js mentorship platform matching students with expert developers, live at letspair.ca.",
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    image: "/projects/letspair.png",
    url: "https://letspair.ca/",
    year: "2024",
    role: "Frontend Engineer",
    timeline: "Sep 2024 - May 2025",
    stack: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
    overview:
      "Let's Pair is a private mentorship platform pairing developers with senior engineers for 1-on-1 React and Node.js tutoring, live at letspair.ca. As frontend engineer, I built the core matching logic, the data layer, and the UI that ties the whole experience together.",
    sections: [
      {
        title: "The Matching Algorithm",
        body: "Built the algorithm in TypeScript that pairs students with mentors based on their goals and skill gaps, powering the tailored technical roadmap at the center of the product.",
      },
      {
        title: "A Scalable Data Layer",
        body: "Modeled students, mentors, sessions, and bookings with Prisma and PostgreSQL, and built a cookie-based authentication system in Next.js to keep the experience secure without adding friction to sign-in.",
      },
      {
        title: "A Responsive, User-Friendly UI",
        body: "Designed and built a responsive interface in Tailwind CSS covering everything from the marketing site to booking a session, keeping the focus on getting students paired with the right mentor quickly.",
      },
    ],
    metrics: [
      { value: "1-on-1", label: "mentor-matched tutoring sessions" },
      { value: "TS", label: "matching algorithm built end to end" },
      { value: "Prisma", label: "+ PostgreSQL data layer" },
      { value: "9 mo", label: "as frontend engineer" },
    ],
  },
];