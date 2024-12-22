import { google } from "@ai-sdk/google";
import { CoreMessage, generateId } from "ai";
import { getMutableAIState, streamUI } from "ai/rsc";
import { z } from "zod";
import { queryExtractor } from "@/lib/agents/workflow/query-extractor";
import { AI, MessageProperty } from "@/app/(server-action)/action-single";

export async function sendMessage(formData: FormData) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  const messages = [...aiState.get().messages];

  const { payloadContent } = await queryExtractor(formData);

  if (payloadContent.length > 0) {
    const messageData: MessageProperty = {
      id: generateId(),
      role: "user",
      content: payloadContent,
    };

    aiState.update({
      ...aiState.get(),
      messages: [...aiState.get().messages, messageData],
    });

    messages.push(messageData);
  }

  const filteredMessages = messages.map(
    ({ id, ...m }) => ({ ...m } as CoreMessage)
  );

  const stream = await streamUI({
    model: google("gemini-1.5-pro-latest"),
    messages: filteredMessages,
    text: async ({ content, done, delta }) => {
      return <div>{content}</div>;
    },
    tools: {
      searchWeb: {
        description: "Search information through external sources.",
        parameters: z.object({
          query: z.string(),
        }),
        generate: async function* ({ query }) {
          return <div>{query}</div>;
        },
      },
    },
  });

  return stream.value;
}
