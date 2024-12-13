import { CoreUserMessage, generateId, TextPart } from "ai";

import { createAI, getAIState } from "ai/rsc";
import {
  AIState,
  ChatProperties,
  MessageProperty,
  UIState,
  UseAction,
} from "@/lib/types/ai";
import { submitMessage } from "@/lib/agents/workflow/submit-message";
import { getServerSession } from "next-auth";
import { titleCrafter } from "@/lib/agents/workflow/title-crafter";
import { saveChat } from "@/lib/agents/action/chat-service";
import { mapUIState } from "@/lib/agents/action/get-ui-state";

const serverInitialAIState: AIState = {
  chatId: generateId(),
  messages: [],
};

const clientInitialUIState: UIState = [];

export const AI = createAI<AIState, UIState, UseAction>({
  initialUIState: clientInitialUIState,
  initialAIState: serverInitialAIState,
  actions: {
    submitMessage,
  },
  onSetAIState: async ({ key, state, done }) => {
    "use server";

    if (!state.messages.some((m) => m.messageType === "answer")) return;

    const { chatId, messages } = state;

    if (done) { 
      const session = await getServerSession();
      const userId = session?.user?.email || "anonymous";

      const chatTitle = await titleCrafter({ context: messages });

      // Add an 'end' message at the end to determine if the history needs to be reloaded
      const updatedMessages: MessageProperty[] = [
        ...messages,
        {
          id: generateId(),
          role: "assistant",
          content: `end`,
          messageType: "end",
        },
      ];

      const chat: ChatProperties = {
        chatId: chatId,
        created: new Date(),
        modelUsed: "",
        userId,
        title: chatTitle,
        messages: updatedMessages,
      };

      await saveChat(userId, chat);
    }
  },
  onGetUIState: async () => {
    "use server";

    const aiState = getAIState();

    if (aiState) {
      const uiState = mapUIState(aiState as ChatProperties);
      return uiState;
    } else {
      return;
    }
  },
});
