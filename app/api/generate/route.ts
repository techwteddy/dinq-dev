import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODELS: Record<string, string> = {
  "dinq-mini": "gemini-1.5-flash",
  "dinq-pro": "gemini-1.5-pro",
  "dinq-ultra": "gemini-2.0-flash",
};

const SYSTEM_PROMPT = `You are Dinq, an expert AI coding assistant built for Ethiopian developers. Generate clean React components using Tailwind CSS. Return ONLY code, no markdown fences, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentCode, mode, model = "dinq-pro" } = await req.json();
    if (!prompt?.trim())
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );

    const geminiModel = MODELS[model] ?? "gemini-1.5-pro";

    let userMessage =
      mode === "edit" && currentCode
        ? `Current code:\n${currentCode}\n\nRequest: ${prompt}\n\nReturn the complete updated component.`
        : mode === "explain" && currentCode
        ? `Explain this code and suggest 3 improvements:\n${currentCode}`
        : `Build this: ${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      }
    );

    const data = await response.json();
    const rawCode = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const code = rawCode
      .replace(/^```(?:tsx?|jsx?|javascript|typescript)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();

    return NextResponse.json({ code });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
