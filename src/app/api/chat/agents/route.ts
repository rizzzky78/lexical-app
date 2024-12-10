import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { ROOT_SYSTEM_INSTRUCTION } from "@/lib/agents/system-instruction/root-agents";
import { rootTools } from "@/lib/agents/tools/root";
import { xai } from "@ai-sdk/xai";

import fs from "fs";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const currentDate = new Date().toLocaleString();

  fs.writeFileSync(
    "./src/debug/state-messages.json",
    JSON.stringify(messages, null, 2)
  );

  const stream = streamText({
    model: google('gemini-1.5-pro'),
    system: ROOT_SYSTEM_INSTRUCTION(currentDate),
    maxSteps: 5,
    tools: rootTools,
    messages,
    onFinish: async (prop) => {
      fs.writeFileSync(
        "./src/debug/chat-api-agents.json",
        JSON.stringify(prop, null, 2)
      );
    },
    experimental_continueSteps: true
  });

  return stream.toDataStreamResponse();
}
