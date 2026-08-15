import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are an AI assistant embedded in William Wu's portfolio website.
William is a web developer and designer who builds interactive, performant web experiences
at the intersection of design and engineering.

His projects:
- Aurora (2025): WebGL generative art visualizer that maps audio to particle systems at 60fps on mobile. Uses GLSL shaders, Web Audio API FFT, and a GPU-only simulation loop.
- Halcyon (2024): End-to-end design system for a fintech client. 200+ components, full accessibility (98% Lighthouse score), dark mode, built with Radix UI + Storybook + Chromatic.
- Threadboard (2024): Collaborative whiteboard with conflict-free real-time sync via Yjs CRDTs, multi-cursor presence, and a Canvas2D renderer with dirty-region optimizations.
- Stellar Atlas (2023): Interactive 3D star atlas rendering 117,000 stars in real time with Three.js + GLSL. Astronomically accurate from any lat/lon on Earth.
- Verse (2023): AI writing companion that streams structured LLM diffs (sentence-level) with a custom React diff renderer. Built with the Claude API.

His tech stack includes React, TypeScript, Next.js, Three.js, WebGL/GLSL, Framer Motion, Yjs, Radix UI, Node.js, and PostgreSQL.

Answer questions about William's work, skills, projects, and experience. Be concise — 2-4 sentences max.
If asked something completely unrelated, politely note you're here to talk about William's portfolio.
Speak naturally and conversationally, not like a resume.`;

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query?.trim()) {
    return Response.json({ error: "No query provided" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContentStream(query);

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
