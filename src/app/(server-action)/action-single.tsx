import { AssistantMessage } from "@/components/kratos/assistant-messages/answer-message";
import { TextStreamMessage } from "@/components/kratos/testing/message";
import { TavilySearch } from "@/components/kratos/tool-ui/tavily-search";
import { tavilySearchClient } from "@/lib/agents/tools/api/tavily";
import { tavilySearchSchema } from "@/lib/agents/tools/schema/tavily";
import { google } from "@ai-sdk/google";
import { CoreMessage, generateId, LanguageModelV1StreamPart } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";

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
      tavily: {
        description: `Search information from external sources`,
        parameters: tavilySearchSchema,
        generate: async function* ({ query, options }) {
          yield (
            <div className="flex flex-col h-screen max-w-2xl mx-auto pt-20 px-4">
              <h2>Using Tavily Tool</h2>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify({ query, options }, null, 2)}
              </pre>
            </div>
          );
          const toolCallId = generateId();
          const tvlyResults = await tavilySearchClient.search(query, options);
          const tavilyAssistantToolCall: CoreMessage[] = [
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "tavily",
                  args: {
                    query,
                    options,
                  },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId,
                  toolName: "tavily",
                  result: JSON.stringify(tvlyResults ?? "an error occured!"),
                },
              ],
            },
          ];
          aiState.done([
            ...(aiState.get() as CoreMessage[]),
            ...tavilyAssistantToolCall,
          ]);
          return <TavilySearch content={tvlyResults} />;
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
