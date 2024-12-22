import { google } from "@ai-sdk/google";
import {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  streamText,
  Message,
} from "ai";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { toolContainer } from "../tools/root";
import { AnswerSection } from "@/components/kratos/ai-message";
import { groq } from "@ai-sdk/groq";
import { AssistantMessage } from "@/components/kratos/assistant-messages/answer-message";
import { xai } from "@ai-sdk/xai";

import fs from "fs";

interface RootAgentPayload {
  model: string;
  messages: CoreMessage[];
  uiStream: ReturnType<typeof createStreamableUI>;
}

export async function agent({ model, messages, uiStream }: RootAgentPayload) {
  let fullResponse: string = "";
  let responseMessages: (CoreAssistantMessage | CoreToolMessage)[] = [];
  let toolResults: Record<string, any>[] = [];

  fs.writeFileSync(
    "./src/debug/state/payload-messages.json",
    JSON.stringify(messages, null, 2)
  );

  const streamableText = createStreamableValue<string>();

  const { fullStream, textStream } = streamText({
    model: google("gemini-1.5-pro"),
    messages,
    maxSteps: 10,
    // tools: toolContainer("not-set", { uiStream }),
    onStepFinish: async (event) => {
      if (event.stepType === "initial") {
        if (event.toolCalls && event.toolCalls.length > 0) {
          uiStream.append(<AssistantMessage content={streamableText.value} />);
          toolResults = event.toolResults;
        } else {
          uiStream.update(<AssistantMessage content={streamableText.value} />);
        }
      }
    },
    onFinish: async (finishedResult) => {
      responseMessages = finishedResult.response.messages;

      fs.writeFileSync(
        "./src/debug/state/agent-root-response.json",
        JSON.stringify(finishedResult, null, 2)
      );
    },
  });

  for await (const delta of fullStream) {
    if (delta.type === "text-delta" && delta.textDelta) {
      fullResponse += delta.textDelta;
      streamableText.update(fullResponse);
    }
  }

  streamableText.done(fullResponse);

  const payload = {
    model,
    text: fullResponse,
    /**
     * The response messages that were generated during the call. It consists of an assistant message, potentially containing tool calls.
     */
    responseMessages,
    toolResults,
  };

  return payload;
}
