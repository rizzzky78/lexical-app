import { streamText } from "ai";
import { google } from "@ai-sdk/google";

import fs from "fs";

const currentDate = new Date().toLocaleString();

const SYSTEM_INSTRUCTION = `You are very helpfull assistant!

current date time: ${currentDate}`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  fs.writeFileSync(
    "./src/debug/state-messages.json",
    JSON.stringify(messages, null, 2)
  );

  const stream = streamText({
    model: google("gemini-1.5-pro"),
    system: SYSTEM_INSTRUCTION,
    maxSteps: 10,
    // tools: rootTools,
    messages,
    onFinish: async (prop) => {
      fs.writeFileSync(
        "./src/debug/chat-api-agents.json",
        JSON.stringify(prop, null, 2)
      );
    },
    experimental_continueSteps: true,
  });

  return stream.toDataStreamResponse();
}
