import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState,
} from "ai/rsc";
import {
  AIState,
  ChatProperties,
  MessageProperty,
  SubmitMessagePayload,
  UIComponent,
  UIState,
  UseAction,
} from "@/lib/types/ai";
import { getServerSession } from "next-auth";
import { titleCrafter } from "@/lib/agents/workflow/title-crafter";
import { getChat, saveChat } from "@/lib/agents/action/chat-service";
import { mapUIState } from "@/lib/agents/action/map-ui-state";
import { FollowupPanel } from "@/components/kratos/assistant-messages/followup-panel";
import { CopilotInquiry } from "@/components/kratos/assistant-messages/inquiry";
import { NextAction } from "@/lib/agents/schema/next-action";
import { inquire } from "@/lib/agents/workflow/inquiry-generator";
import { queryExtractor } from "@/lib/agents/workflow/query-extractor";
import { querySuggestor } from "@/lib/agents/workflow/query-suggestor";
import { agent } from "@/lib/agents/workflow/root";
import { taskManager } from "@/lib/agents/workflow/task-manager";

import fs from "fs";

async function submitMessage(
  payload: SubmitMessagePayload
): Promise<UIComponent> {
  "use server";

  fs.writeFileSync(
    "./src/debug/state/submit-message-payoad.json",
    JSON.stringify(payload, null, 2)
  );

  const {
    userId,
    model,
    messageType,
    scope,
    classify = false,
    formData,
  } = payload;

  const aiState = getMutableAIState<typeof AI>();

  const uiStream = createStreamableUI();

  const { payloadContent } = await queryExtractor(formData);

  const aiMessages = [...aiState.get().messages];

  const messages = aiMessages
    .filter(
      (m) =>
        m.messageType !== "followup-panel" &&
        m.messageType !== "related" &&
        m.messageType !== "end"
    )
    .map((m) => {
      const { role, content } = m;
      return { role, content } as CoreMessage;
    });

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: "user",
        content: payloadContent,
        messageType,
      },
    ],
  });

  messages.push({
    role: "user",
    content: payloadContent,
  });

  // run the workflow

  let nextAction: NextAction = { next: "proceed" };

  /**
   * Run the task manager if the classify is set to `true`
   * @sub_agent
   */
  if (classify) {
    const { next } = await taskManager({
      model,
      messages,
      scope: scope.taskManager,
    });

    nextAction = { next };
  }

  /**
   * Run the Inquire if `nextAction` prop is `inquire`
   * @sub_agent
   */
  if (nextAction.next === "inquire") {
    const inquiry = await inquire({
      model,
      messages,
      uiStream,
      scope: scope.inquire,
    });

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: "assistant",
          messageType: "inquiry",
          content: [
            {
              type: "text",
              text: JSON.stringify(inquiry),
            },
          ],
        },
      ],
    });

    uiStream.append(<CopilotInquiry inquiry={inquiry} />);

    uiStream.done();

    return {
      id: generateId(),
      component: uiStream.value,
    };
  }

  /**
   * Run the main Agent
   * @main_agent
   */
  const { responseMessages, text, toolResults } = await agent({
    model,
    messages,
    uiStream,
  });

  const filteredMessages = responseMessages.map((v) => {
    return {
      id: generateId(),
      role: v.role,
      content: v.content,
      messageType: "answer",
      toolName: v.role === "tool" ? v.content[0].toolName : undefined,
    } as MessageProperty;
  });

  // update the ai state
  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, ...filteredMessages],
  });

  // message with assistant answer
  const assistantMessageAnswer: CoreMessage[] = [
    ...messages,
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text,
        },
      ],
    },
  ];

  /**
   * Run the query suggestor
   * @main_agent
   */
  if (scope.related) {
    const relatedQuery = await querySuggestor({
      model,
      uiStream,
      messages: assistantMessageAnswer,
      scope: scope.related,
    });

    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: "assistant",
          messageType: "related",
          content: [
            {
              type: "text",
              text: JSON.stringify(relatedQuery),
            },
          ],
        },
      ],
    });
  }

  // add UI for follow up panel
  uiStream.append(<FollowupPanel />);

  // done ui stream
  uiStream.done();

  // save the state

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: "assistant",
        messageType: "followup-panel",
        content: "followup-panel",
      },
    ],
  });

  return {
    id: generateId(),
    component: uiStream.value,
  };
}

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
    // sendMessage
  },
  onSetAIState: async ({ key, state, done }) => {
    "use server";

    if (!state.messages.some((m) => m.messageType === "answer")) return;

    const { chatId, messages } = state;

    if (done) {
      const session = await getServerSession();
      const userId = session?.user?.email || "anonymous";
      let chatTitle: string = "";

      const currentChatData = await getChat(chatId);

      if (!currentChatData || !currentChatData.title) {
        chatTitle = await titleCrafter({ context: messages });
      }

      const lastMessages = messages.filter((m) => m.messageType !== "end");

      // Add an 'end' message at the end to determine if the history needs to be reloaded
      const updatedMessages: MessageProperty[] = [
        ...lastMessages,
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
        modelUsed: "not-set",
        userId: userId ?? "anonymous",
        title: chatTitle,
        messages: updatedMessages,
      };

      await saveChat(userId, chat);
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
