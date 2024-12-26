import {
  Message,
  TextStreamMessage,
} from "@/components/kratos/testing/message";
import {
  SYSTEM_INSTRUCT_INSIGHT,
  SYSTEM_INSTRUCT_PRODUCTS,
  SYSTEM_INSTRUCT_RELATED,
} from "@/lib/agents/system-instructions";
import { scrapeUrl } from "@/lib/agents/tools/api/firecrawl";
import { google } from "@ai-sdk/google";
import {
  CoreMessage,
  generateId,
  generateText,
  streamObject,
  streamText,
} from "ai";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { z } from "zod";
import { ProductCardContainer } from "@/components/kratos/product-card-container";
import { PartialRelated, ProductsResponse } from "@/lib/types/general";
import { xai } from "@ai-sdk/xai";
import { RelatedMessage } from "@/components/kratos/related-message";
import { getServerSession } from "next-auth";
import { getChat } from "@/lib/agents/action/chat-service";
import { _debugHelper } from "@/lib/utility/debug/root";
import {
  SendMessageCallback,
  AIState,
  UIState,
  UseAction,
} from "@/lib/types/ai";
import {
  handleSaveChat,
  mutateTool,
  toCoreMessage,
} from "@/lib/agents/action/server-action-handler";

const sendMessage = async (f: FormData): Promise<SendMessageCallback> => {
  "use server";

  const userMessage = f.get("text_input") as string;

  console.log(`triggered server action - sendMessage, meta: ${userMessage}`);

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: "user",
        content: userMessage,
      },
    ],
  });

  const streamableText = createStreamableValue<string>("");

  const assistantMessage = <TextStreamMessage content={streamableText.value} />;

  const { value, stream } = await streamUI({
    model: google("gemini-2.0-flash-exp"),
    system: `You are very helpfull assistant!`,
    messages: toCoreMessage(aiState.get().messages),
    text: async function* ({ content, done, delta }) {
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: generateId(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        streamableText.update(content);
      }

      return assistantMessage;
    },
    tools: {
      searchProduct: {
        description: `Search product from user query`,
        parameters: z.object({
          query: z.string(),
        }),
        generate: async function* ({ query }) {
          let finalizedResults: ProductsResponse = { data: [] };

          const uiStream = createStreamableUI(
            <div>
              <div>
                <h2>Searching for {query}</h2>
              </div>
            </div>
          );

          const encodedQuery = encodeURIComponent(
            query.replace(/\s+/g, "+")
          ).replace(/%2B/g, "+");

          const URLQuery = `https://www.tokopedia.com/search?q=${encodedQuery}`;

          yield uiStream.value;

          const scrapeContent = await scrapeUrl({
            url: URLQuery,
            formats: ["markdown", "screenshot"],
            waitFor: 4000,
          });

          uiStream.append(
            <div>
              <div className="bg-green-300">
                <h2>Processing {query}</h2>
              </div>
            </div>
          );

          yield uiStream.value;

          if (scrapeContent.success && scrapeContent.markdown) {
            uiStream.update(
              <div>
                <h2>Extracting the raw data...</h2>
                <div>
                  <pre className="text-xs">
                    {JSON.stringify(scrapeContent.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            );

            yield uiStream.value;

            const payload = {
              objective: `Extract only product data including: product images, product link, and store link.`,
              markdown: scrapeContent.markdown,
            };

            const streamableObject = createStreamableValue<any>();

            uiStream.update(
              <Message role={"assistant"}>
                <ProductCardContainer
                  content={{ data: [] }}
                  isFinished={false}
                />
              </Message>
            );

            yield uiStream.value;

            const { partialObjectStream } = streamObject({
              model: google("gemini-2.0-flash-exp"),
              system: SYSTEM_INSTRUCT_PRODUCTS,
              prompt: JSON.stringify(payload),
              schema: z.object({
                data: z.array(
                  z.object({
                    title: z.string().describe("Product title or name"),
                    image: z.string().describe("Product image URL"),
                    price: z.string().describe("Product price"),
                    rating: z
                      .string()
                      .describe("Product rating from 0.0 to 5.0"),
                    sold: z.string().describe("Number of products sold"),
                    link: z.string().describe("Product detail page URL"),
                    store: z.object({
                      name: z.string().describe("Store or seller name"),
                      location: z.string().describe("Store location"),
                      isOfficial: z
                        .boolean()
                        .describe("Whether the store is an official store"),
                    }),
                  })
                ),
              }),
              onFinish: async ({ object }) => {
                if (object) {
                  finalizedResults = object;
                }
              },
            });

            for await (const chunk of partialObjectStream) {
              streamableObject.update(chunk);
              console.log(chunk);
            }

            streamableObject.done(finalizedResults);
          }

          uiStream.update(
            <Message role={"assistant"}>
              <ProductCardContainer
                content={finalizedResults}
                isFinished={true}
              />
            </Message>
          );

          const streamableText = createStreamableValue<string>("");

          uiStream.append(<TextStreamMessage content={streamableText.value} />);

          yield uiStream.value;

          let finalizedText: string = "";

          const { textStream } = streamText({
            model: xai("grok-beta"),
            system: SYSTEM_INSTRUCT_INSIGHT,
            prompt: JSON.stringify(finalizedResults),
            onFinish: ({ text }) => {
              finalizedText = text;
            },
          });

          for await (const texts of textStream) {
            finalizedText += texts;
            streamableText.update(finalizedText);
          }

          streamableText.done();

          const { mutate } = mutateTool({
            name: "searchProduct",
            args: query,
            result: finalizedResults,
            overrideAssistant: {
              content: finalizedText,
            },
          });

          aiState.done({
            ...aiState.get(),
            messages: [...aiState.get().messages, ...mutate],
          });

          const streamableRelated = createStreamableValue<PartialRelated>();

          uiStream.append(
            <Message role={"assistant"}>
              <RelatedMessage relatedQueries={streamableRelated.value} />
            </Message>
          );

          yield uiStream.value;

          const payloadRelated = toCoreMessage(aiState.get().messages);

          const relateds = streamObject({
            model: google("gemini-1.5-pro"),
            system: SYSTEM_INSTRUCT_RELATED,
            prompt: JSON.stringify(
              payloadRelated.filter((m) => m.role !== "tool")
            ),
            schema: z.object({
              items: z
                .array(
                  z.object({
                    query: z.string(),
                  })
                )
                .length(3),
            }),
          });

          for await (const related of relateds.partialObjectStream) {
            streamableRelated.update(related);
          }

          streamableRelated.done();

          uiStream.done();

          return uiStream.value;
        },
      },
    },
  });

  return { id: generateId(), display: value, stream };
};

/**
 * AI Provider for: **StreamUI**
 *
 * @method StreamUI
 */
export const AI = createAI<AIState, UIState, UseAction>({
  initialUIState: [],
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      _debugHelper("ai-state", state);
      await handleSaveChat(state);
    }
  },
  // onGetUIState: async () => {
  //   'use server'

  //   const aiState = getAIState<typeof AI>()

  //   if (aiState) {
  //     const uiState =
  //   } else {
  //     return
  //   }
  // }
});

export interface ExtendedCoreMessage extends Omit<CoreMessage, "id"> {
  id: string;
}

export const mapUIState = (state: AIState) => {
  const messages: ExtendedCoreMessage[] = Array.isArray(state.messages)
    ? state.messages.map((m) => ({ ...m, id: generateId() }))
    : [];

  const x = messages.map(({ id }) => {});
};
