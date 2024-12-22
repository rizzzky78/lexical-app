import { SubmitMessagePayload, UIComponent } from "@/lib/types/ai";
import { google } from "@ai-sdk/google";
import { CoreMessage, Message, convertToCoreMessages, generateId } from "ai";
import { getMutableAIState, streamUI } from "ai/rsc";
import { storageService } from "../storage-service";
import { queryExtractor } from "../../workflow/query-extractor";
import { AI } from "@/app/action";
import { z } from "zod";

export async function sendMessage(
  payload: SubmitMessagePayload
): Promise<UIComponent> {
  "use server";

  const {
    userId,
    model,
    messageType,
    scope,
    classify = false,
    formData,
  } = payload;

  const aiState = getMutableAIState<typeof AI>();

  const aiMessages = [...aiState.get().messages];

  const messages = aiMessages
    .filter(
      (m) =>
        m.messageType !== "followup-panel" &&
        m.messageType !== "related" &&
        m.messageType !== "end"
    )
    .map((m) => {
      const { role, content } = m;
      return { role, content } as CoreMessage;
    });

  const { payloadContent } = await queryExtractor(formData);

  if (payloadContent.length > 0) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: "user",
          content: payloadContent,
          messageType,
        },
      ],
    });

    messages.push({
      role: "user",
      content: payloadContent,
    });
  }

  const stream = await streamUI({
    model: google("gemini-1.5-pro-latest"),
    messages,
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
          return <div></div>
        },
      },
    },
  });

  return {
    id: generateId(),
    component: stream.value,
  };
}
