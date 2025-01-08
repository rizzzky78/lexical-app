import {
  SYSTEM_INSTRUCT_DEFINED_INSIGHT,
  SYSTEM_INSTRUCT_EXTRACTOR,
  SYSTEM_INSTRUCT_INSIGHT,
  SYSTEM_INSTRUCT_PRODUCTS,
  SYSTEM_INSTRUCT_RELATED,
} from "@/lib/agents/system-instructions";
import { scrapeUrl } from "@/lib/agents/tools/api/firecrawl";
import { google } from "@ai-sdk/google";
import { generateId, JSONValue, streamObject, streamText } from "ai";
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
import { mapUIState } from "@/lib/agents/action/map-ui-state";
import { productSchema } from "@/lib/agents/schema/product-schema";
import { SectionToolResult } from "@/components/kratos/section-tool-result";
import { StreamAssistantMessage } from "@/components/kratos/assistant-message";
import { groq } from "@ai-sdk/groq";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { ObjectStreamMessage } from "@/components/kratos/testing/object";
import logger from "@/lib/utility/logger/root";

const sendMessage = async (f: FormData): Promise<SendMessageCallback> => {
  "use server";

  const textInput = f.get("text_input") as string;

  const attachLink = f.get("attach_link") as string | null;

  const userMessage = JSON.stringify({
    text_input: textInput,
    attach_link: attachLink ?? null,
  });

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

  const assistantMessage = (
    <StreamAssistantMessage content={streamableText.value} />
  );

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

          const uiStream = createStreamableUI();

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
            if (scrapeContent.screenshot) {
              uiStream.append(
                <div>
                  <h2>Extracting the raw data...</h2>
                  <div>
                    <div>
                      <Image
                        src={scrapeContent.screenshot}
                        alt={scrapeContent.metadata?.title || "Product"}
                        fill
                      />
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(scrapeContent.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              );

              yield uiStream.value;
            }

            const payload = {
              objective: `Extract only product data including: product images, product link, and store link.`,
              markdown: scrapeContent.markdown,
            };

            const streamableObject = createStreamableValue<any>();

            uiStream.update(
              <SectionToolResult args={{ query }}>
                <ProductCardContainer
                  content={{ data: [] }}
                  isFinished={false}
                />
              </SectionToolResult>
            );

            yield uiStream.value;

            const { partialObjectStream } = streamObject({
              model: google("gemini-2.0-flash-exp"),
              system: SYSTEM_INSTRUCT_PRODUCTS,
              prompt: JSON.stringify(payload),
              schema: productSchema,
              onFinish: async ({ object }) => {
                if (object) {
                  finalizedResults = {
                    screenshot: scrapeContent.screenshot,
                    data: object.data,
                  };
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
            <SectionToolResult args={{ query }}>
              <ProductCardContainer
                content={finalizedResults}
                isFinished={true}
              />
            </SectionToolResult>
          );

          const streamableText = createStreamableValue<string>("");

          uiStream.append(
            <StreamAssistantMessage content={streamableText.value} />
          );

          yield uiStream.value;

          let finalizedText: string = "";

          const { textStream } = streamText({
            model: groq("llama-3.2-90b-vision-preview"),
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
            args: { query },
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
            <RelatedMessage relatedQueries={streamableRelated.value} />
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
      getProductDetails: {
        description: `Get product details by given link or URL.`,
        parameters: z.object({
          link: z.string().describe("The given url or link by user"),
          query: z
            .string()
            .describe(
              "An additional query, this is used as a wayfinder such as searching for specific information. These queries adjust based on user input."
            ),
        }),
        generate: async function* ({ link, query }) {
          logger.info(`Executing tool: <getProductDetails>`, { query });

          const uiStream = createStreamableUI();

          uiStream.append(
            <div>
              <div>
                <p>Proceed with Query: {link}</p>
              </div>
            </div>
          );

          yield uiStream.value;

          const scrapeResult = await scrapeUrl({
            url: link,
            formats: ["markdown", "screenshot"],
          });

          if (scrapeResult.success && scrapeResult.markdown) {
            if (scrapeResult.screenshot) {
              uiStream.append(
                <div>
                  <div className="max-w-3xl max-h-[40rem]">
                    <Image
                      src={scrapeResult.screenshot}
                      alt={scrapeResult.metadata?.title || "product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              );

              yield uiStream.value;
            }

            const payloadRequest = {
              // query,
              data: scrapeResult.markdown,
            };

            const streamableObject = createStreamableValue();

            uiStream.append(
              <div className="animate-pulse">
                <ObjectStreamMessage content={streamableObject.value} />
              </div>
            );

            yield uiStream.value;

            const payloadContent = {
              prompt: `Extract the product description with a full details. This also includes product ratings which include images and comments (if any) with a maximum of 5 product rating data (take the rating that is most helpful to the user).`,
              data: scrapeResult.markdown,
            };

            let finalizedObject: JSONValue = {};

            const { partialObjectStream } = streamObject({
              model: google("gemini-2.0-flash-exp"),
              system: SYSTEM_INSTRUCT_EXTRACTOR,
              prompt: JSON.stringify(payloadContent),
              output: "no-schema",
              onFinish: async ({ object }) => {
                finalizedObject = object as JSONValue;
              },
            });

            for await (const objProduct of partialObjectStream) {
              finalizedObject = objProduct;
              streamableObject.update(finalizedObject);
            }

            streamableObject.done();

            const streamableText = createStreamableValue<string>("");

            uiStream.append(
              <StreamAssistantMessage content={streamableText.value} />
            );

            yield uiStream.value;

            let finalizedText: string = "";

            const { textStream } = streamText({
              model: google("gemini-2.0-flash-exp"),
              system: SYSTEM_INSTRUCT_DEFINED_INSIGHT,
              prompt: JSON.stringify(payloadRequest),
              onFinish: async ({ text }) => {
                finalizedText = text;
              },
            });

            for await (const text of textStream) {
              finalizedText += text;
              streamableText.update(finalizedText);
            }

            streamableText.done();

            const { mutate } = mutateTool({
              name: "getProductDetails",
              args: { link, query },
              result: finalizedObject,
              overrideAssistant: {
                content: finalizedText,
              },
            });

            aiState.done({
              ...aiState.get(),
              messages: [...aiState.get().messages, ...mutate],
            });
          }

          // final
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
      const session = await getServerSession();
      await handleSaveChat(state, session);
    }
  },
  onGetUIState: async () => {
    "use server";

    const aiState = getAIState<typeof AI>();

    if (aiState) {
      const uiState = mapUIState(aiState);
      return uiState;
    } else {
      return;
    }
  },
});
