import {
  Message,
  TextStreamMessage,
} from "@/components/kratos/testing/message";
import {
  SYSTEM_INSTRUCT_INSIGHT,
  SYSTEM_INSTRUCT_PRODUCTS,
} from "@/lib/agents/system-instructions";
import { scrapeUrl } from "@/lib/agents/tools/api/firecrawl";
import { google } from "@ai-sdk/google";
import {
  CoreMessage,
  generateId,
  generateObject,
  LanguageModelV1StreamPart,
  streamObject,
  streamText,
} from "ai";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { mutateTool } from "./handler";
import { ObjectStreamMessage } from "@/components/kratos/testing/object";
import {
  ProductCardContainer,
  // ProductCardContainerStream,
} from "@/components/kratos/product-card-container";
import { PartialProductsResponse, ProductsResponse } from "@/lib/types/general";
import { xai } from "@ai-sdk/xai";

export type UseAction = {
  sendMessage: (f: FormData) => any;
};

export type SendMessageCallback = {
  value: ReactNode;
  stream: ReadableStream<LanguageModelV1StreamPart>;
};

export type AIState = {
  chatId: string;
  messages: CoreMessage[];
  isSharedPage?: boolean;
};

export type UIState = {
  id: string;
  display: ReactNode;
}[];

const sendMessage = async (f: FormData) => {
  "use server";

  const userMessage = f.get("text_input") as string;

  const aiState = getMutableAIState<typeof AI>("messages");

  const currentAIState = aiState.get() as CoreMessage[];

  aiState.update([...currentAIState, { role: "user", content: userMessage }]);

  const streamableText = createStreamableValue<string>("");

  const assistantMessage = <TextStreamMessage content={streamableText.value} />;

  const { value, stream } = await streamUI({
    model: google("gemini-2.0-flash-exp"),
    system: `You are very helpfull assistant!`,
    messages: aiState.get() as CoreMessage[],
    text: async function* ({ content, done, delta }) {
      if (done) {
        aiState.done([
          ...(aiState.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);
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
          let finalizedPartialResults: PartialProductsResponse = {};

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

            // await new Promise((resolve) => setTimeout(resolve, 3000));

            const streamableObject = createStreamableValue<any>();

            // uiStream.update(
            //   // <ProductCardContainerStream
            //   //   key={"stream-key"}
            //   //   content={streamableObject.value}
            //   // />
            //   <ObjectStreamMessage content={streamableObject.value} />
            // );

            uiStream.update(
              <ProductCardContainer content={{ data: [] }} isFinished={false} />
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

            // yield uiStream.value;

            for await (const chunk of partialObjectStream) {
              streamableObject.update(chunk);
              finalizedPartialResults = chunk;
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
            process.stdout.write(texts);
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

          aiState.done([...(aiState.get() as CoreMessage[]), ...mutate]);

          return uiStream.value;
        },
      },
    },
  });

  return { value, stream };
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
      // save
    }
  },
});
