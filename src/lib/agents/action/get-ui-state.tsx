import { ReactNode } from "react";
import {
  AIState,
  AssistantMessageType,
  ChatProperties,
  MessageProperty,
  UIComponent,
  UIState,
  UserMessageType,
} from "@/lib/types/ai";
import { DebugMessage } from "@/components/kratos/debug-message";
import { FollowupPanel } from "@/components/kratos/assistant-messages/followup-panel";

/**
 * Maps AI state to UI state for rendering components dynamically.
 * @param aiState AIState containing messages and chat details.
 * @returns UIState array with id and component mappings.
 */
export const mapUIState = (aiState: AIState): UIState => {
  const messages: MessageProperty[] = Array.isArray(aiState.messages)
    ? aiState.messages.map((m) => ({ ...m }))
    : [];

  let lastRelatedPanel: UIComponent | null = null;
  // Track the last followup-panel message
  let lastFollowupPanel: UIComponent | null = null;

  // Modified mapping to handle followup-panel
  const processedMessages = messages
    .map(({ id, role, messageType, content, toolName }) => {
      //
      if (role === "assistant" && messageType === "related") {
        lastRelatedPanel = {
          id,
          component: <DebugMessage source={messageType} data={content} />,
        };
        return null;
      }
      // Handle followup-panel separately
      if (role === "assistant" && messageType === "followup-panel") {
        lastFollowupPanel = {
          id,
          component: <FollowupPanel />,
        };
        return null;
      }

      // Process other messages normally
      switch (role) {
        case "user":
          return handleUserMessage(id, messageType as UserMessageType, content);
        case "assistant":
          return handleAssistantMessage(
            id,
            messageType as AssistantMessageType,
            content
          );
        case "tool":
          return handleToolMessage(id, toolName, content);
        default:
          return null;
      }
    })
    .filter((m): m is NonNullable<typeof m> => m !== null);

  // If a followup-panel exists, append it to the end
  return lastFollowupPanel && lastRelatedPanel
    ? [...processedMessages, lastRelatedPanel, lastFollowupPanel]
    : processedMessages;
};

/**
 * Handles user messages and returns the corresponding component.
 * @param id Message ID.
 * @param messageType UserMessageType.
 * @param content Message content.
 * @returns UI state object for the user message.
 */
const handleUserMessage = (
  id: string,
  messageType: UserMessageType,
  content: unknown
): { id: string; component: ReactNode } | null => {
  switch (messageType) {
    case "text_input": {
      const textPart = content;
      return {
        id,
        component: <DebugMessage source={messageType} data={textPart} />,
      };
    }
    case "text_input_attachment": {
      const attachmentPart = content;
      return {
        id,
        component: <DebugMessage source={messageType} data={attachmentPart} />,
      };
    }
    case "attachment":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    case "inquiry_input":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    case "related_input":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    case "quiz_answer_choice":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    case "quiz_next_input":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    default:
      return null; // Handle unsupported user message types.
  }
};

/**
 * Handles assistant messages and returns the corresponding component.
 * @param id Message ID.
 * @param messageType AssistantMessageType.
 * @param content Message content.
 * @returns UI state object for the assistant message.
 */
const handleAssistantMessage = (
  id: string,
  messageType: AssistantMessageType,
  content: unknown
): { id: string; component: ReactNode } | null => {
  if (typeof content === "string") {
    return { id, component: <div>{content}</div> }; // Render plain text.
  }

  // Add cases for structured types if necessary
  switch (messageType) {
    case "answer":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    case "followup-panel":
      return {
        id,
        component: <FollowupPanel />,
      };
    case "related":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    case "markdown":
      return {
        id,
        component: <DebugMessage source={messageType} data={content} />,
      };
    default:
      return null; // Handle unsupported assistant message types.
  }
};

/**
 * Handles tool messages and returns the corresponding component.
 * @param id Message ID.
 * @param toolName Name of the tool.
 * @param content Tool content.
 * @returns UI state object for the tool message.
 */
const handleToolMessage = (
  id: string,
  toolName: string | undefined,
  content: unknown
): { id: string; component: ReactNode } | null => {
  if (!toolName) return null;

  // Replace placeholders with actual components for specific tools
  switch (toolName) {
    case "tavilySearch": {
      return {
        id,
        component: <DebugMessage source={toolName} data={content} />,
      };
    }
    case "fireCrawlExtraction": {
      return {
        id,
        component: <DebugMessage source={toolName} data={content} />,
      };
    }
    case "serperSearch":
      return {
        id,
        component: <DebugMessage source={toolName} data={content} />,
      };
    default:
      return { id, component: <div>Unsupported Tool: {toolName}</div> };
  }
};
