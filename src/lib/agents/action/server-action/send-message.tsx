import { google } from "@ai-sdk/google";
import { CoreMessage, Message, convertToCoreMessages } from "ai";
import { streamUI } from "ai/rsc";

export async function sendMessage(messages: CoreMessage[]) {
  "use server";
  const stream = await streamUI({
    model: google("gemini-1.5-pro-latest"),
    messages,
    text: async ({ content, done, delta }) => {
      return <div>{content}</div>;
    },
    tools: {},
  });

  return stream.value;
}
