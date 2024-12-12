import { AI } from "@/app/action";
import { MessageProperty, UserMessageType } from "@/lib/types/ai";
import { CoreMessage, CoreUserMessage, generateId } from "ai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { agent } from "./root";

type SubmitMessagePayload = {
  message: CoreMessage;
  userId: string;
  model: string;
  messageType: UserMessageType;
  enableRelated?: boolean;
};

export async function submitMessage(payload: SubmitMessagePayload) {
  "use server";

  const {
    userId,
    model,
    messageType,
    message: { role, content },
  } = payload;

  const aiState = getMutableAIState<typeof AI>();

  const uiStream = createStreamableUI();

  const aiMessages = [...aiState.get().messages];

  const messages = aiMessages
    .filter(
      (m) =>
        m.messageType !== "followup" &&
        m.messageType !== "related" &&
        m.messageType !== "end"
    )
    .map((m) => {
      const { role, content } = m;
      return { role, content } as CoreMessage;
    });

  if (content.length) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role,
          content,
        },
      ],
    });

    messages.push(payload.message);
  }

  // run the workflow
  uiStream.append(<div>Loading...</div>);

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
}
