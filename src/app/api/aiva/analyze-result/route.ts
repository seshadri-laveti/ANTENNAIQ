import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface AnalyzeResultBody {
  kind: "s11" | "vswr" | "gain" | "pattern" | "current";
  data: {
    targetFreqGHz?: number;
    simulatedFreqGHz?: number;
    minS11dB?: number;
    bandwidthMHz?: number;
    gainDBi?: number;
    efficiency?: number;
    points?: { freq: number; val: number }[];
    notes?: string;
  };
  projectContext?: string;
}

const SYSTEM_PROMPT = `You are AIVA — Antenna Intelligence & Virtual Assistant — analyzing a simulation result reported by the student.

Based on the kind of result and the numeric data provided, you should:
1. Compute error vs target (e.g., frequency error %, bandwidth adequacy, gain margin)
2. Give a clear PASS / WARN / FAIL verdict with rationale
3. Provide engineering interpretation of WHY the result is what it is (e.g., resonance too low → patch too long)
4. Suggest a concrete next experiment or tuning direction
5. Close with "NEXT STEP:" — a single actionable item

Style:
- Use ALL CAPS section headers: VERDICT, ANALYSIS, INTERPRETATION, NEXT STEP
- Quote concrete numbers and percentages
- Keep under 350 words
- If the result is bad, do not be reassuring — be direct about what is wrong
- If the result is good, briefly acknowledge and recommend moving forward`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeResultBody;
    if (!body.kind || !body.data) {
      return NextResponse.json({ error: "Missing kind or data" }, { status: 400 });
    }

    const zai = await ZAI.create();
    const userPrompt = `Analyze this ${body.kind.toUpperCase()} result:

DATA (JSON):
${JSON.stringify(body.data, null, 2)}

${body.projectContext ? `PROJECT CONTEXT:\n${body.projectContext}` : ""}

Provide your verdict, analysis, and recommended next step.`;

    const response = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 700,
    });

    // Compute simple metrics client-side too
    const data = body.data;
    let quick = {} as Record<string, any>;
    if (body.kind === "s11" && data.targetFreqGHz && data.simulatedFreqGHz) {
      const errPct = ((data.simulatedFreqGHz - data.targetFreqGHz) / data.targetFreqGHz) * 100;
      const passed = Math.abs(errPct) < 2 && (data.minS11dB ?? 0) <= -10;
      quick = {
        freqErrorPct: errPct.toFixed(2),
        passed,
        verdict: passed ? "PASS" : Math.abs(errPct) > 5 ? "FAIL" : "WARN",
      };
    }

    return NextResponse.json({
      content: response.choices[0]?.message?.content || "",
      quick,
    });
  } catch (err: any) {
    console.error("AIVA analyze-result error:", err);
    return NextResponse.json(
      { error: "Result analysis unavailable.", detail: err?.message },
      { status: 500 }
    );
  }
}
