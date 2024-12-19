import { AI } from "@/app/action";
import {
  MessageProperty,
  UIComponent,
  SubmitMessagePayload,
  UserMessageType,
} from "@/lib/types/ai";
import {
  CoreMessage,
  CoreUserMessage,
  FilePart,
  generateId,
  ImagePart,
} from "ai";
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from "ai/rsc";
import { agent } from "./root";
import { querySuggestor } from "./query-suggestor";
import { RelatedQuery } from "../schema/related-query";

import fs from "fs";
import { FollowupPanel } from "@/components/kratos/assistant-messages/followup-panel";
import { inquire } from "./inquiry-generator";
import { taskManager } from "./task-manager";
import { NextAction } from "../schema/next-action";
import { CopilotInquiry } from "@/components/kratos/assistant-messages/inquiry";
import { storageService } from "../action/storage-service";
import { fileTypeFromBuffer } from "file-type";
import { AssistantMessage } from "@/components/kratos/assistant-messages/answer-message";

export async function submitMessage(
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

  // parse payload
  const { textEntries, filesEntries } = await storageService.processFormData(
    formData
  );
  const payloadContent: CoreUserMessage["content"] = [];

  if (textEntries.length > 0) {
    payloadContent.push({ type: "text", text: textEntries[0].value });
  }

  if (filesEntries.length > 0) {
    // Map to create an array of file processing promises
    const fileProcessingPromises = filesEntries.map(async (v) => {
      const fileType = await fileTypeFromBuffer(v.buffer);
      const isImage = fileType?.mime.startsWith("image/");

      if (isImage) {
        return {
          type: "image",
          image: v.base64,
          mimeType: fileType?.mime,
        } as ImagePart;
      } else {
        return {
          type: "file",
          data: v.base64,
          mimeType: fileType?.mime,
        } as FilePart;
      }
    });

    // Wait for all file processing to complete
    const processedFiles = await Promise.all(fileProcessingPromises);

    payloadContent.push(...processedFiles);
  }

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

  if (payloadContent.length > 0) {
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
  }

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

  const streamableText = createStreamableValue<string>("");

  uiStream.append(<AssistantMessage content={streamableText.value} />);

  /**
   * Run the main Agent
   * @main_agent
   */
  const { responseMessages, text, toolResults } = await agent({
    model,
    messages,
    uiStream,
    strText: streamableText,
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
