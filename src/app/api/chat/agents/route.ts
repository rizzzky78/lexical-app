import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = streamText({
    model: google("gemini-1.5-pro"),
    system: "you are very hepfull assistant!",
    maxSteps: 5,
    tools: {},
    messages,
  });

  return stream.toDataStreamResponse();
}
