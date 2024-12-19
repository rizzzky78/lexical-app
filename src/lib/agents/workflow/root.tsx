import { google } from "@ai-sdk/google";
import {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  streamText, Message
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
  strText: ReturnType<typeof createStreamableValue<string>>
}

export async function agent({ model, messages, uiStream, strText }: RootAgentPayload) {
  let fullResponse: string = "";
  let responseMessages: (CoreAssistantMessage | CoreToolMessage)[] = [];
  let toolResults: Record<string, any>[] = [];

  fs.writeFileSync(
    "./src/debug/state/payload-messages.json",
    JSON.stringify(messages, null, 2)
  );

  // const streamableText = createStreamableValue<string>("");

  // uiStream.append(<AssistantMessage content={streamableText.value} />);

  const { fullStream, textStream } = streamText({
    model: google("gemini-1.5-pro"),
    messages,
    maxSteps: 10,
    // tools: toolContainer("not-set", { uiStream }),
    onStepFinish: async (e) => {
      if (e.stepType === "initial") {
        if (e.toolCalls && e.toolCalls.length > 0) {
          toolResults = e.toolCalls;
        }
      }
    },
    onFinish: async (finishedResult) => {
      responseMessages = finishedResult.response.messages;
      // streamableText.done(fullResponse);
      fs.writeFileSync(
        "./src/debug/state/agent-root-response.json",
        JSON.stringify(finishedResult, null, 2)
      );
    },
  });

  for await (const tStream of textStream) {
    console.log(tStream)
    // streamableText.update(tStream);
    strText.update(tStream)
    fullResponse += tStream;
  }

  strText.done()
  // streamableText.done()

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
