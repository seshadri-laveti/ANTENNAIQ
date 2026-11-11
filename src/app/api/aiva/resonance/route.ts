import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface ResonanceBody {
  targetGHz: number;
  actualGHz: number;
  context?: {
    antennaType?: string;
    strategy?: string;
    patchLength?: number;
    slotLength?: number;
    substrate?: string;
  };
}

const SYSTEM_PROMPT = `You are AIVA — Antenna Intelligence & Virtual Assistant — diagnosing a resonance frequency error.

Given a target resonance and an actual resonance, produce a diagnostic that:
1. Quantifies the direction and magnitude of the error (too low / too high, by how much, in %)
2. Lists the most likely causes ranked by probability (effective length too long/short, slot length, feed position, substrate ε variation, mesh error)
3. Explains the physics — why each cause shifts resonance the way it does
4. Recommends ONE first experiment to run (e.g., sweep patch length 28 → 30 mm in 0.5 mm steps)
5. Explains why that variable and not others

Style:
- ALL CAPS headers: DIAGNOSIS, LIKELY CAUSES, RECOMMENDED FIRST EXPERIMENT, RATIONALE
- One short bullet per cause, with physics justification
- Close with "NEXT STEP:" and the single most actionable item
- Be honest: do not recommend sweeping everything simultaneously — change ONE variable first`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ResonanceBody;
    if (!body.targetGHz || !body.actualGHz) {
      return NextResponse.json({ error: "Missing target or actual frequency" }, { status: 400 });
    }

    const errPct = ((body.actualGHz - body.targetGHz) / body.targetGHz) * 100;
    const direction = errPct < 0 ? "TOO LOW" : "TOO HIGH";

    const zai = await ZAI.create();
    const userPrompt = `Diagnose this resonance error:

TARGET: ${body.targetGHz} GHz
ACTUAL: ${body.actualGHz} GHz
ERROR: ${errPct.toFixed(2)}% (${direction})

${body.context ? `CONTEXT:\n${JSON.stringify(body.context, null, 2)}` : ""}

Provide your diagnosis, likely causes ranked by probability, recommended first experiment, and rationale.`;

    const response = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    return NextResponse.json({
      content: response.choices[0]?.message?.content || "",
      quick: {
        errPct: errPct.toFixed(2),
        direction,
        magnitudeMHz: Math.abs(errPct * body.targetGHz * 10).toFixed(1),
      },
    });
  } catch (err: any) {
    console.error("AIVA resonance error:", err);
    return NextResponse.json(
      { error: "Resonance diagnostic unavailable.", detail: err?.message },
      { status: 500 }
    );
  }
}
