import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface ChatRequestBody {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  context?: string;
}

const SYSTEM_PROMPT = `You are AIVA — Antenna Intelligence & Virtual Assistant — for the ANTENNAIQ platform.
You help students, researchers, and engineers with:
- Antenna theory (patch, slot, monopole, MIMO, DGS, CPW, fractal, reconfigurable)
- HFSS modeling workflow (variables, materials, geometry, ports, boundaries, mesh, sweeps)
- S-parameter interpretation (S11, VSWR, bandwidth, gain, efficiency)
- Radiation pattern analysis (main lobe, side lobes, nulls, beamwidth, F/B ratio)
- Resonance diagnostics and optimization strategies
- Research paper analysis and research gap identification

Style rules:
- Be precise, engineering-grade, and concrete. Quote numbers, formulas, and equations.
- When a user reports a problem (e.g., resonance at 2.21 GHz instead of 2.45 GHz), give a step-by-step diagnostic with the most likely causes ranked by probability and the FIRST experiment they should run.
- Distinguish "detected visually" from "confirmed by HFSS data".
- Use plain text formatting with clear headers (ALL CAPS short labels) and short bullet lines.
- Always close with a single recommended next action prefixed with "NEXT STEP:".
- If asked about specific numbers, prefer the project context the user provides.
- If the user uploads a screenshot description, do not fabricate what is visually present — be honest about what can and cannot be inferred from a description alone, and ask for the actual image if visual analysis is required.

You are an antenna engineering expert. Be helpful, direct, and rigorous.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages || [];

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const fullMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT + (body.context ? `\n\nPROJECT CONTEXT:\n${body.context}` : "") },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      messages: fullMessages,
      temperature: 0.4,
      max_tokens: 1400,
    });

    return NextResponse.json({
      content: response.choices[0]?.message?.content || "",
    });
  } catch (err: any) {
    console.error("AIVA chat error:", err);
    return NextResponse.json(
      { error: "AIVA is unavailable right now. Please retry.", detail: err?.message },
      { status: 500 }
    );
  }
}
