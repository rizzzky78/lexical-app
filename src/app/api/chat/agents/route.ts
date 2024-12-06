import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { ROOT_SYSTEM_INSTRUCTION } from "@/lib/agents/system-instruction/root-agents";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const currentDate = new Date().toLocaleString();

  const stream = streamText({
    model: google("gemini-1.5-pro"),
    system: ROOT_SYSTEM_INSTRUCTION(currentDate),
    maxSteps: 5,
    tools: {},
    messages,
  });

  return stream.toDataStreamResponse();
}
