import { generateId } from "ai";

import { createAI } from "ai/rsc";
import { AIState, UIState, UseAction } from "@/lib/types/ai";

export const AI = createAI<AIState, UIState, UseAction>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {},
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
