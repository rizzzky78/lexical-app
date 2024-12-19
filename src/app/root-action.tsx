import { sendMessage } from "@/lib/agents/action/server-action/send-message";
import { AIState, UIState } from "@/lib/types/ai";
import { CoreMessage, generateId } from "ai";
import { createAI } from "ai/rsc";

type UseAction = {
  sendMessage: (messages: CoreMessage[]) => ReturnType<typeof sendMessage>;
};

export const RootAI = createAI<AIState, UIState, UseAction>({
  initialUIState: [],
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  actions: {
    sendMessage,
  },
});
