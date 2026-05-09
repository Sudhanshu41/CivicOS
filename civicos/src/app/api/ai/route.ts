import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); 

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    let hasKey = !!process.env.GEMINI_API_KEY;

    if (!hasKey) {
      // Graceful degradation / Mock Response
      await new Promise((r) => setTimeout(r, 1000));
      
      let mockReply = "I have analyzed your request. Telemetry indicates nominal operations with isolated escalations. No critical system failure imminent.";
      if (message.toLowerCase().includes("active emergenc")) mockReply = `There are currently ${context?.cityMetrics?.activeIncidents || 0} active incidents across the city grid. Emergency flow is prioritizing critical sectors.`;
      if (message.toLowerCase().includes("traffic")) mockReply = "Traffic Control is currently operating at elevated capacity. Rerouting algorithms are actively bypassing Sector 4 anomalies.";
      if (message.toLowerCase().includes("escalation")) mockReply = `We have recorded ${context?.cityMetrics?.criticalEscalations || 0} critical escalations. The AI orchestration score remains high at ${context?.cityMetrics?.aiCoordinationScore || 94}%.`;

      return NextResponse.json({
        reply: mockReply,
        telemetry: {
          confidence: 96,
          latency: 840,
        }
      });
    }

    const prompt = `You are CivicOS Core AI, the conversational operational intelligence assistant for a futuristic smart city.
Your role is to summarize incidents, explain escalations, answer operational questions, and provide recommendations.
Be concise, professional, tactical, and use an elite command-center tone (e.g. use words like telemetry, anomaly, orchestration).

Current System Telemetry:
${JSON.stringify(context?.cityMetrics || {})}

User Command: ${message}
    `;

    const start = Date.now();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt],
    });
    const latency = Date.now() - start;

    return NextResponse.json({
      reply: response.text || "No intelligence generated.",
      telemetry: {
        confidence: 94,
        latency: latency,
      }
    });

  } catch (error) {
    console.error("AI Copilot Error:", error);
    return NextResponse.json(
      { reply: "System anomaly: Unable to reach AI orchestration core." },
      { status: 500 }
    );
  }
}
