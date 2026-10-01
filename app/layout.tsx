import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "William Wu",
  description:
    "William Wu is a Vancouver web developer building interactive, performant web experiences at the intersection of design and engineering.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0C0E12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Loaded at runtime so builds work offline; swap for next/font/google if you prefer */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800&family=Familjen+Grotesk:wght@400;500;600&family=Fragment+Mono&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
