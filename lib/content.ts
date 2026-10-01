// All copy lives here so it's easy to edit without touching components.

export const profile = {
  name: "William Wu",
  tagline: "Web Developer · Designer · Tinkerer",
  location: "Vancouver, BC",
  coords: "49.28° N, 123.12° W",
  established: "1995",
  intro:
    "I build interactive, performant web experiences at the intersection of design and engineering.",
  bio: [
    "I'm William, a web developer based in Vancouver. I love shipping things on the web that feel polished, fast, and a little bit alive.",
    "I split my time between writing TypeScript and obsessing over easing curves, with experience across startups and studios.",
  ],
  email: "williamwuu3@gmail.com",
  github: "https://github.com/williamwu01",
  linkedin: "https://www.linkedin.com/in/williamwu01/",
  resume: "https://williamwu.info/William_Wu_Resume.pdf",
};

export const stats = [
  { value: "3+", label: "years building" },
  { value: "5", label: "gym sessions a week" },
  { value: "3", label: "coffees a day" },
];

export type Job = {
  role: string;
  company: string;
  dates: string;
  points: string[];
};

export const experience: Job[] = [
  {
    role: "Configuration Analyst",
    company: "Forward Insurance Managers Ltd.",
    dates: "Mar 2026 – Present",
    points: [
      "Configure insurance products in an enterprise platform, including form interfaces and custom premium and liability calculations.",
      "Test REST API endpoints and build internal JavaScript tools for configuration workflows.",
    ],
  },
  {
    role: "Project Manager & Developer",
    company: "PulseHire AI",
    dates: "May 2025 – Mar 2026",
    points: [
      "Led development of an AI interviewing job board in Next.js with a full admin dashboard and API integrations.",
      "Set up GA4/GTM analytics and SEO, and ran delivery with Kanban and Gantt planning.",
    ],
  },
  {
    role: "Web Developer & UI/UX Designer",
    company: "Vancouver WebTeck",
    dates: "May 2024 – Mar 2026",
    points: [
      "Built responsive client websites end to end with React, Next.js, PHP, WordPress and Shopify.",
      "Designed wireframes, prototypes and site maps in Figma.",
    ],
  },
  {
    role: "Frontend Engineer",
    company: "Let's Pair Education",
    dates: "Sep 2024 – May 2025",
    points: [
      "Built the student–mentor matching algorithm in TypeScript on Prisma and PostgreSQL data models.",
      "Implemented cookie-based auth in Next.js and a responsive UI in Tailwind CSS.",
    ],
  },
  {
    role: "WordPress Developer",
    company: "Henesys Digital",
    dates: "Jun 2024 – Sep 2024",
    points: [
      "Wrote custom shortcodes for contact info, banners, buttons and card components.",
      "Improved performance with media optimization and script and stylesheet cleanup.",
    ],
  },
];

export type Project = {
  name: string;
  slug: string;
  year: string;
  kind: string;
  description: string;
  role: string;
  stack: string[];
  problem: string;
  approach: string[];
  results: string[];
  live?: { label: string; href: string };
  image?: { src: string; width: number; height: number };
  hue: number; // tint of the bubble's iridescence
};

export const projects: Project[] = [
  {
    name: "RideLink",
    slug: "ridelink",
    year: "2026",
    kind: "Booking platform",
    description:
      "Ride booking platform for Vancouver with SMS-powered booking and notifications.",
    role: "Full-stack developer",
    stack: ["Next.js", "TypeScript", "Twilio", "PostgreSQL"],
    problem:
      "Local ride bookings in Vancouver were handled over scattered phone calls and texts, with no record of who was picked up, when, or what was owed.",
    approach: [
      "Built a booking flow in Next.js that captures trip details and confirms them over SMS via Twilio, so riders and drivers get the same record without needing an app install.",
      "Designed the data model in PostgreSQL to track bookings, statuses, and notification history, so support issues can be traced back to an exact message.",
      "Added driver-facing views for upcoming rides and a simple status board for dispatch.",
    ],
    results: [
      "Replaced ad hoc phone/text coordination with a single auditable booking flow.",
      "SMS confirmations cut down on missed or disputed pickups.",
    ],
    live: { label: "ridelinkyvr.com", href: "https://ridelinkyvr.com" },
    image: { src: "/projects/ridelink.png", width: 1440, height: 7564 },
    hue: 200,
  },
  {
    name: "Shars Hair Lab",
    slug: "shar-lab",
    year: "2026",
    kind: "WordPress · Booking",
    description:
      "Custom WordPress booking site for a hair salon, with a custom theme and plugin powering Square-integrated payments and scheduling.",
    role: "WordPress developer & designer",
    stack: ["WordPress", "PHP", "Square API", "Custom theme/plugin"],
    problem:
      "The salon needed online booking that actually charged deposits and synced with the chair schedule, not a generic contact-form plugin bolted onto a template theme.",
    approach: [
      "Built a custom WordPress theme from a Figma design rather than adapting a stock template, so the site matched the salon's brand exactly.",
      "Wrote a custom plugin integrating the Square API for deposit payments and appointment scheduling tied to stylist availability.",
      "Tuned asset loading and media so the site stays fast despite the custom booking logic.",
    ],
    results: [
      "Clients book and pay deposits in one flow instead of calling in.",
      "Stylist schedules stay in sync automatically through Square.",
    ],
    image: { src: "/projects/shar-lab.png", width: 1440, height: 2997 },
    hue: 320,
  },
  {
    name: "TaskBuddy",
    slug: "taskbuddy",
    year: "2026",
    kind: "Personal tool",
    description:
      "Task management app built in vanilla JavaScript for organizing work and staying on top of what matters.",
    role: "Solo developer",
    stack: ["JavaScript", "HTML5", "CSS3"],
    problem:
      "I wanted a lightweight task tool shaped around how I actually work, without framework overhead for something this small.",
    approach: [
      "Built the whole app in vanilla JavaScript with no build step, focusing on fast interactions and local persistence.",
      "Designed the UI around quick capture and prioritization rather than nested projects and settings screens.",
    ],
    results: [
      "A daily-driver task tool with no load time and no dependencies to maintain.",
    ],
    hue: 150,
  },
  {
    name: "PulseHire AI",
    slug: "pulsehire",
    year: "2025",
    kind: "AI · Job board",
    description:
      "AI interviewing job board built with Next.js, with a full admin dashboard, API integrations, and GA4/GTM analytics.",
    role: "Project manager & developer",
    stack: ["Next.js", "TypeScript", "REST APIs", "GA4", "Google Tag Manager"],
    problem:
      "Employers needed a job board that could screen candidates with AI-driven interviews and give recruiters a real admin workflow, not just a list of postings.",
    approach: [
      "Led development of the platform end to end in Next.js, including the candidate-facing job board and an admin dashboard for recruiters.",
      "Integrated third-party APIs powering the AI interview flow and wired up GA4/GTM for funnel and SEO visibility.",
      "Ran delivery with Kanban for day-to-day work and Gantt planning for milestone tracking across the team.",
    ],
    results: [
      "Shipped a working AI interviewing flow with a recruiter-facing admin dashboard.",
      "Analytics in place from launch, giving the team funnel and SEO data instead of guesswork.",
    ],
    image: { src: "/projects/pulsehire.png", width: 1440, height: 4945 },
    hue: 260,
  },
  {
    name: "Vancouver WebTeck",
    slug: "webteck",
    year: "2024",
    kind: "Client work · Agency",
    description:
      "Responsive client websites built end to end with React, Next.js, WordPress and Shopify, designed in Figma.",
    role: "Web developer & UI/UX designer",
    stack: ["React", "Next.js", "PHP", "WordPress", "Shopify", "Figma"],
    problem:
      "Agency clients needed sites built fast across very different stacks — custom React apps, WordPress brochure sites, Shopify storefronts — each with its own design from scratch.",
    approach: [
      "Designed wireframes, prototypes and site maps in Figma for each client before writing code.",
      "Built responsive sites end to end across React/Next.js, PHP, WordPress, and Shopify depending on the client's needs and budget.",
    ],
    results: [
      "Delivered multiple client sites across different stacks on agency timelines.",
    ],
    image: { src: "/projects/webteck.png", width: 1440, height: 12477 },
    hue: 30,
  },
  {
    name: "Let's Pair",
    slug: "letspair",
    year: "2024",
    kind: "EdTech · Mentorship",
    description:
      "1-on-1 React and Node.js mentorship platform matching students with expert developers.",
    role: "Frontend engineer",
    stack: ["TypeScript", "Prisma", "PostgreSQL", "Next.js", "Tailwind CSS"],
    problem:
      "Matching students to the right mentor by skill and availability, then handling accounts securely, needed real data modeling, not a spreadsheet.",
    approach: [
      "Built the student–mentor matching algorithm in TypeScript on top of Prisma and PostgreSQL data models.",
      "Implemented cookie-based authentication in Next.js and a responsive UI in Tailwind CSS.",
    ],
    results: [
      "A working matching platform connecting students with mentors 1-on-1.",
    ],
    live: { label: "letspair.ca", href: "https://letspair.ca" },
    image: { src: "/projects/letspair.png", width: 1440, height: 3532 },
    hue: 175,
  },
];

export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "PHP", "SQL", "HTML5", "CSS3", "GLSL"] },
  { group: "Front-end", items: ["React", "Next.js", "Tailwind CSS", "Responsive / mobile-first", "Accessibility (WCAG)"] },
  { group: "Motion & 3D", items: ["Framer Motion", "GSAP", "Three.js"] },
  { group: "Back-end", items: ["Node.js", "Express.js", "REST APIs", "OAuth 2.0", "Prisma ORM"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"] },
  { group: "Cloud & DevOps", items: ["Vercel", "AWS (EC2, S3, Lambda)", "Azure", "Cloudflare (WAF / DDoS)", "Git / GitHub"] },
  { group: "CMS & commerce", items: ["WordPress", "WooCommerce", "Shopify", "Strapi (headless)"] },
  { group: "Integrations", items: ["Twilio", "PayPal", "Square"] },
  { group: "Testing", items: ["Jest", "Selenium", "Swagger"] },
  { group: "Analytics & design", items: ["GA4", "Google Tag Manager", "Figma"] },
];
