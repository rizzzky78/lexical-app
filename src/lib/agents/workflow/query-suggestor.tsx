import { CoreMessage, streamObject } from "ai";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { PartialRelated, relatedSchemaOutput } from "../schema/related-query";
import { google } from "@ai-sdk/google";

type QuerySuggestorPayload = {
  model: string;
  messages: CoreMessage[];
  /**
   * The scope to craft related query, can be based on
   *
   * - `last-message` which only refers to last message to craf related query
   * - `overall` are cover all available messages including tool
   */
  scope: "last-message" | "overall";
  uiStream: ReturnType<typeof createStreamableUI>;
};

export async function querySuggestor({
  model,
  messages,
  scope = "last-message",
  uiStream,
}: QuerySuggestorPayload) {
  let finalRelatedQuery: PartialRelated = {};

  const streamableObject = createStreamableValue<PartialRelated>();

  uiStream.append(<div>DATA</div>);

  const lastMessages = messages.slice(-1).map((m) => {
    return { ...m, role: "user" } as CoreMessage;
  });

  const payloadMessages = scope === "last-message" ? lastMessages : messages;

  const { partialObjectStream, object } = streamObject({
    model: google("gemini-1.5-pro"),
    system: ``,
    messages: payloadMessages,
    schema: relatedSchemaOutput,
    onFinish: async (finishedResult) => {
      streamableObject.done(finalRelatedQuery);
    },
  });

  for await (const related of partialObjectStream) {
    if (related.items) {
      streamableObject.update(related);
      finalRelatedQuery = related;
    }
  }

  return await object;
}
