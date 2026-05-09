import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); // Defaults to process.env.GEMINI_API_KEY

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

    let hasKey = !!process.env.GEMINI_API_KEY;

    if (!hasKey) {
      // Graceful degradation / Mock Response
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json({
        category: title.toLowerCase().includes("fire") ? "emergency" : "infrastructure",
        severity: "high",
        department: title.toLowerCase().includes("fire") ? "emergency" : "infrastructure",
        inferredTitle: title || "Unidentified Incident",
        summary: "Simulated AI Analysis: Infrastructure or Emergency incident detected.",
        confidence: 88,
      });
    }

    // Prepare content for Gemini
    const contents: Record<string, unknown>[] = [
      `Analyze this city incident report and return ONLY a JSON object with these exact keys: "category", "severity", "department", "inferredTitle", "summary", "confidence".
      
      Categories: infrastructure, traffic, emergency, sanitation, environmental, utility_failure, public_safety.
      Severities: low, medium, high, critical.
      
      Title: ${title}
      Description: ${description}`
    ];

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      contents.push({
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);

    return NextResponse.json({
      category: result.category || "infrastructure",
      severity: result.severity || "medium",
      department: result.department || "infrastructure",
      inferredTitle: result.inferredTitle || title || "AI Analyzed Incident",
      summary: result.summary || "Analysis complete.",
      confidence: result.confidence || 92,
    });

  } catch (error) {
    console.error("AI Incident Analysis Error:", error);
    return NextResponse.json(
      { error: "Analysis failed", category: "infrastructure", severity: "medium", department: "infrastructure" },
      { status: 500 }
    );
  }
}
