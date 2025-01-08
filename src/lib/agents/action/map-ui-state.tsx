import { ReactNode } from "react";
import { AssistantMessage } from "@/components/kratos/assistant-message";
import { UserMessage } from "@/components/kratos/user-message";
import { FileMessage } from "@/components/kratos/file-message";
import { ImageMessage } from "@/components/kratos/image-message";
import { ToolCallMessage } from "@/components/kratos/toll-call-message";
import { ProductCardContainer } from "@/components/kratos/product-card-container";
import {
  AIState,
  MessageProperty,
  UIState,
  AvailableTool,
  ExtendedToolResult,
} from "@/lib/types/ai";
import { ToolCallPart, ToolContent } from "ai";
import { ProductsResponse } from "@/lib/types/general";
import { SectionToolResult } from "@/components/kratos/section-tool-result";

// Core message content types based on the existing system
type MessageContent = {
  type: string;
  text?: string;
  data?: string;
  image?: string;
  toolName?: AvailableTool;
  result?: string;
};

// UI State item type
type UIStateItem = {
  id: string;
  display: ReactNode;
};

// Generate unique IDs
const generateUniqueId = (baseId: string, index: number): string =>
  `${baseId}-${index}`;

// Type-safe handler for tool results
const handleProductSearch = (result: string, id: string): UIStateItem => {
  const resulted_searchProduct: ExtendedToolResult<
    { args: string },
    ProductsResponse
  > = JSON.parse(result);
  return {
    id,
    display: (
      <ProductCardContainer
        key={id}
        content={resulted_searchProduct.data}
        isFinished
      />
    ),
  };
};

// Handle tool results with proper typing
const handleToolResult = (
  toolContent: MessageContent,
  id: string
): UIStateItem => {
  switch (toolContent.toolName) {
    case "searchProduct":
      return handleProductSearch(toolContent.result || "", id);
    default:
      const resulted_default: ExtendedToolResult = JSON.parse(
        toolContent.result || ""
      );
      return {
        id,
        display: (
          <SectionToolResult args={resulted_default}>
            <div className="bg-green-200">
              <div>
                <h2>HANDLE TOOL-RESULT DISPLAY</h2>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(toolContent, null, 2)}
                </pre>
              </div>
            </div>
          </SectionToolResult>
        ),
      };
  }
};

// Type-safe content handlers
const contentTypeHandlers: Record<
  string,
  (content: MessageContent, id: string) => UIStateItem | null
> = {
  text: (content, id) =>
    content.text
      ? {
          id,
          display: <AssistantMessage content={content.text} />,
        }
      : null,

  file: (content, id) =>
    content.data
      ? {
          id,
          display: <FileMessage data={content.data} />,
        }
      : null,

  image: (content, id) =>
    content.image
      ? {
          id,
          display: <ImageMessage data={content.image} />,
        }
      : null,

  "tool-call": (content, id) => ({
    id,
    display: <ToolCallMessage data={content as ToolCallPart} />,
  }),

  "tool-result": (content, id) => handleToolResult(content, id),
};

// Process content arrays with type safety
const processContentArray = (
  content: MessageContent[],
  baseId: string,
  defaultHandler: (content: MessageContent, id: string) => UIStateItem | null
): UIState => {
  return content
    .map((item, index) => {
      const id = generateUniqueId(baseId, index);
      const handler = contentTypeHandlers[item.type] || defaultHandler;
      return handler(item, id);
    })
    .filter((item): item is UIStateItem => item !== null);
};

// Type-safe role handlers
const roleHandlers: Record<
  MessageProperty["role"],
  (message: MessageProperty, index: number) => UIState
> = {
  assistant: (message, index) => {
    if (!Array.isArray(message.content)) {
      return [
        {
          id: generateUniqueId(message.id, index),
          display: <AssistantMessage content={message.content as string} />,
        },
      ];
    }
    return processContentArray(
      message.content as MessageContent[],
      message.id,
      (content, id) => ({
        id,
        display: <AssistantMessage content={content as unknown as string} />,
      })
    );
  },

  user: (message, index) => {
    if (!Array.isArray(message.content)) {
      return [
        {
          id: message.id,
          display: <UserMessage content={message.content as string} />,
        },
      ];
    }
    return processContentArray(
      message.content as MessageContent[],
      message.id,
      (content, id) => ({
        id,
        display: <UserMessage content={content as unknown as string} />,
      })
    );
  },

  tool: (message) => {
    if (!Array.isArray(message.content)) return [];
    const toolContent = message.content as unknown as ToolContent;
    if (toolContent[0]?.toolName === "searchProduct") {
      return [handleProductSearch(toolContent[0].result as string, message.id)];
    }
    return [];
  },

  system: () => [], // Handle system messages (usually ignored in UI)
};

// Main mapping function with proper typing
export const mapUIState = (state: AIState): UIState => {
  const messages = Array.isArray(state.messages) ? state.messages : [];
  return messages.flatMap((message, index) =>
    roleHandlers[message.role](message, index)
  );
};
