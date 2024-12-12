import { AI } from "@/app/action";
import {
  MessageProperty,
  SubmitMessagePayload,
  UserMessageType,
} from "@/lib/types/ai";
import { CoreMessage, CoreUserMessage, generateId } from "ai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { agent } from "./root";
import { querySuggestor } from "./query-suggestor";
import { RelatedQuery } from "../schema/related-query";

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
        m.messageType !== "followup-panel" &&
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
          messageType,
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

  const enableRelated = payload.enableRelated;

  if (enableRelated?.scopeRelated) {
    const relatedQuery = await querySuggestor({
      model,
      uiStream,
      messages: assistantMessageAnswer,
      scope: enableRelated.scopeRelated,
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
  uiStream.append(<div>FOLLOW UP PANEL</div>);

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
