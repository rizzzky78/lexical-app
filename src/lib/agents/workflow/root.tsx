import { google } from "@ai-sdk/google";
import {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  streamText,
} from "ai";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { toolContainer } from "../tools/root";
import { AnswerSection } from "@/components/kratos/ai-message";

interface RootAgentPayload {
  model: string;
  messages: CoreMessage[];
  uiStream: ReturnType<typeof createStreamableUI>;
}

export async function agent({ model, messages, uiStream }: RootAgentPayload) {
  let fullResponse: string = "";
  let responseMessages: (CoreAssistantMessage | CoreToolMessage)[] = [];
  let toolResults: Record<string, any>[] = [];

  const streamableText = createStreamableValue<string>("");

  const { fullStream, response } = streamText({
    model: google("gemini-1.5-pro"),
    messages,
    maxSteps: 10,
    tools: toolContainer("not-set", { uiStream }),
    onStepFinish: async (e) => {
      if (e.stepType === "initial") {
        if (e.toolCalls && e.toolCalls.length > 0) {
          uiStream.append(<AnswerSection text={streamableText.value} />);
          toolResults = e.toolCalls
        } else {
          uiStream.append(<AnswerSection text={streamableText.value} />);
        }
      }
    },
    onFinish: async (finishedResult) => {
      responseMessages = finishedResult.response.messages;
      streamableText.done(fullResponse);
    },
  });

  for await (const delta of fullStream) {
    if (delta.type === "text-delta" && delta.textDelta) {
      fullResponse += delta.textDelta;
      streamableText.update(delta.textDelta);
    }
  }

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
