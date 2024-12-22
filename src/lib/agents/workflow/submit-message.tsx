"use server";

import { AI } from "@/app/action";
import {
  MessageProperty,
  UIComponent,
  SubmitMessagePayload,
} from "@/lib/types/ai";
import { CoreMessage, generateId } from "ai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { agent } from "./root";
import { querySuggestor } from "./query-suggestor";

import fs from "fs";
import { FollowupPanel } from "@/components/kratos/assistant-messages/followup-panel";
import { inquire } from "./inquiry-generator";
import { taskManager } from "./task-manager";
import { NextAction } from "../schema/next-action";
import { CopilotInquiry } from "@/components/kratos/assistant-messages/inquiry";
import { queryExtractor } from "./query-extractor";

export async function submitMessage(
  payload: SubmitMessagePayload
): Promise<UIComponent> {
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
