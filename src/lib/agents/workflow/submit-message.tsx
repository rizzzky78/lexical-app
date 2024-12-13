import { AI } from "@/app/action";
import {
  MessageProperty,
  SubmitMessagePayload,
  UserMessageType,
} from "@/lib/types/ai";
import { CoreMessage, generateId } from "ai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { agent } from "./root";
import { querySuggestor } from "./query-suggestor";
import { RelatedQuery } from "../schema/related-query";

import fs from "fs";
import { FollowupPanel } from "@/components/kratos/assistant-messages/followup-panel";

export async function submitMessage(payload: SubmitMessagePayload) {
  "use server";

  console.log(JSON.stringify(payload, null, 2));
  fs.writeFileSync(
    "./src/debug/state/submit-message-payoad.json",
    JSON.stringify(payload, null, 2)
  );

  const {
    userId,
    model,
    messageType,
    message: { role, content },
  } = payload;

  const aiState = getMutableAIState<typeof AI>();

  const uiStream = createStreamableUI();

  uiStream.append(<div>Loading...</div>);

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

  console.log(
    "from messages payload <submitMessage()> ",
    JSON.stringify(messages, null, 2)
  );

  // run the workflow
  uiStream.update(null);

  const { responseMessages, text, toolResults } = await agent({
    model,
    messages,
    uiStream,
  });

  console.log("resulted text :", text);

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
