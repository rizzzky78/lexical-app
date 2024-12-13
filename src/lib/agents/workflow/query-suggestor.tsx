import { CoreMessage, streamObject } from "ai";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import {
  PartialRelated,
  RelatedQuery,
  relatedSchemaOutput,
} from "../schema/related-query";
import { google } from "@ai-sdk/google";
import { RelatedMessage } from "@/components/kratos/assistant-messages/related-message";

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

const SYSTEM_INSTRUCTION = `As a professional web researcher, your task is to generate a set of three queries that explore the subject matter more deeply, building upon the initial query and the information uncovered in its search results.

For instance, if the original query was "Starship's third test flight key milestones", your output should follow this format:

Aim to create queries that progressively delve into more specific aspects, implications, or adjacent topics related to the initial query. The goal is to anticipate the user's potential information needs and guide them towards a more comprehensive understanding of the subject matter.

Please match the language of the response to the user's language.`;

export async function querySuggestor({
  model,
  messages,
  scope = "last-message",
  uiStream,
}: QuerySuggestorPayload): Promise<RelatedQuery> {
  let finalRelatedQuery: PartialRelated = {};

  const streamableObject = createStreamableValue<PartialRelated>();

  uiStream.append(<RelatedMessage related={streamableObject.value} />);

  const lastMessages = messages.slice(-1).map((m) => {
    return { ...m, role: "user" } as CoreMessage;
  });

  const payloadMessages = scope === "last-message" ? lastMessages : messages;

  const { partialObjectStream, object } = streamObject({
    model: google("gemini-1.5-pro"),
    system: SYSTEM_INSTRUCTION,
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
