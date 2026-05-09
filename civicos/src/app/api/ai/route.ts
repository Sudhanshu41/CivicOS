import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); 

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    const prompt = `You are CIVIC CORE, the operational intelligence engine of CivicOS.
Your role is to summarize incidents, explain escalations, answer operational questions, and provide recommendations.
Be concise, professional, tactical, and use an elite command-center tone (e.g. use words like telemetry, anomaly, orchestration).

Current System Telemetry:
${JSON.stringify(context?.cityMetrics || {})}
Current Departments:
${JSON.stringify(context?.departments || {})}
Active Incidents Summary:
${JSON.stringify(Object.values(context?.incidents || {}).map((i: Record<string, unknown>) => ({ id: i.id, title: i.title, severity: i.severity, status: i.status })))}
Active Orchestrations (Workflows):
${JSON.stringify(context?.workflows || [])}

User Command: ${message}
    `;

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [prompt],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            controller.enqueue(encoder.encode(chunk.text));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });

  } catch (error) {
    console.error("AI Copilot Error:", error);
    return new Response(
      "System anomaly: Unable to reach AI orchestration core. Verify GEMINI_API_KEY.",
      { status: 500 }
    );
  }
}
