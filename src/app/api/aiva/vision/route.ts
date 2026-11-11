import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface VisionBody {
  imageBase64: string; // data URL or raw base64
  stage?: string; // e.g. "Radiation Boundary", "S11 Plot"
  mimeType?: string;
}

const SYSTEM_PROMPT = `You are AIVA — Antenna Intelligence & Virtual Assistant — for the ANTENNAIQ platform, analyzing an HFSS screenshot uploaded by a student or engineer.

When analyzing the image:
1. Identify what is visually present (geometry type, port, boundary, plot, etc.)
2. Note what is NOT visible or cannot be confirmed from the screenshot alone
3. Flag possible issues (boundary not assigned, port direction, mesh quality, plot type, units, scale, anomalies)
4. Provide a recommended next step for the user

Style rules:
- Use ALL CAPS short section headers: IMAGE ANALYSIS, DETECTED VISUALLY, POSSIBLE ISSUES, RECOMMENDED
- Be honest about uncertainty — distinguish "I see X" from "I cannot verify X from this screenshot"
- Quote specific numerical values if they appear (resonance freq, S11 dip, gain, etc.)
- Always close with "NEXT STEP:" and one concrete action
- Keep total response under 350 words

Engineering context: The student is at stage "${"{stage}"} in their HFSS workflow.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VisionBody;
    if (!body.imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const zai = await ZAI.create();

    const userPrompt = `Please analyze this HFSS screenshot${body.stage ? ` (current workflow stage: ${body.stage})` : ""}.
Identify the geometry, ports, boundaries, plots, or any anomalies visible. Note what can be confirmed visually versus what needs verification through HFSS data. Provide actionable recommendations for the next step.`;

    // Build message content with image
    const imageUrl = body.imageBase64.startsWith("data:")
      ? body.imageBase64
      : `data:${body.mimeType || "image/png"};base64,${body.imageBase64}`;

    const response = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT.replace("{stage}", body.stage || "unspecified") },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    return NextResponse.json({
      content: response.choices[0]?.message?.content || "",
    });
  } catch (err: any) {
    console.error("AIVA vision error:", err);
    return NextResponse.json(
      { error: "Vision analysis unavailable.", detail: err?.message },
      { status: 500 }
    );
  }
}
