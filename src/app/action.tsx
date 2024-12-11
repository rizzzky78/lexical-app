import { CoreMessage, generateId } from "ai";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react";

import {
  createAI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { AIMessage, TextStreamMessage } from "@/components/kratos/ai-message";
import { google } from "@ai-sdk/google";
import { tavilySearchSchema } from "@/lib/agents/tools/schema/tavily";
import { tavilySearchClient } from "@/lib/agents/tools/api/tavily";
import TavilyUI from "@/components/kratos/mock-tavily-result";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";

import fs from "fs";

export const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AIProvider>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    {
      role: "user",
      content: message,
    },
  ]);

  const contentStream = createStreamableValue<string>();

  const SYSTEM_INSTRUCT = `You are very helpfull assistant!`;

  const textComponent = <TextStreamMessage content={contentStream.value} />;

  fs.writeFileSync(
    "./debug/state-messages.json",
    JSON.stringify(messages.get(), null, 2)
  );

  const { value: stream } = await streamUI({
    model: groq("llama-3.1-70b-versatile"),
    system: SYSTEM_INSTRUCT,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      tavilySearch: {
        description: "An intellegent web search tool",
        parameters: tavilySearchSchema,
        generate: async function* (properties) {
          const toolCallId = generateId();

          console.log(
            "tavily search request: ",
            JSON.stringify(properties, null, 2)
          );

          const contentResult = await tavilySearchClient.search(
            properties.query,
            properties.options
          );

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "tavilySearch",
                  args: JSON.stringify(properties),
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "tavilySearch",
                  toolCallId,
                  result: JSON.stringify(contentResult),
                },
              ],
            },
          ]);

          return (
            <AIMessage
              role="assistant"
              content={
                <TavilyUI content={JSON.stringify(contentResult, null, 2)} />
              }
            />
          );
        },
      },
      getWeather: {
        description: "Get weather from query location",
        parameters: z.object({ query: z.string() }),
        generate: async function* (query) {
          const toolCallId = generateId();

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "getWeather",
                  args: query,
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "getWeather",
                  toolCallId,
                  result: {
                    query,
                    data: `The weather in ${query.query} is raining with a thunderstorm.`,
                  },
                },
              ],
            },
          ]);

          return <AIMessage role="assistant" content={"raining"} />;
        },
      },
    },
  });
  return stream;
};

export type UIState = ReactNode[];

export type AIState = {
  chatId: string;
  messages: CoreMessage[];
};

type SendMessageProps = ReturnType<typeof sendMessage>;

export type UseAction = {
  sendMessage: (
    message: string
  ) => Promise<
    | bigint
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | AwaitedReactNode
  >;
};

export const AIProvider = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ key, state, done }) => {
    "use server";

    if (done) {
      //save
    }
  },
  // onGetUIState: async () => {
  //   const aiState = getAIState('user_message')
  //   if (aiState) {

  //   }
  // },
});
