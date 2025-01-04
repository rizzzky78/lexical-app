import { CoreMessage, LanguageModelV1StreamPart } from "ai";
import { ReactNode } from "react";

export interface ExtendedCoreMessage extends Omit<CoreMessage, "id"> {
  id: string;
}

export type MessageProperty = {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: CoreMessage["content"];
};

export type ChatProperties = {
  chatId: string;
  title: string;
  created: Date;
  userId: string;
  messages: MessageProperty[];
  sharePath?: string;
} & Record<string, any>;

export type UseAction = {
  sendMessage: (f: FormData) => Promise<SendMessageCallback>;
};

export type SendMessageCallback = {
  id: string;
  display: ReactNode;
  stream: ReadableStream<LanguageModelV1StreamPart>;
};

export type AIState = {
  chatId: string;
  messages: MessageProperty[];
  isSharedPage?: boolean;
};

export type UIState = {
  id: string;
  display: ReactNode;
}[];

export const AvailableTools = {
  SEARCH_PRODUCT: "searchProduct",
  GET_PRODUCT_DETAILS: "getProductDetails",
} as const;

export type AvailableTool =
  (typeof AvailableTools)[keyof typeof AvailableTools];

export type MutationPayload = {
  name: AvailableTool;
  args: unknown;
  result: unknown;
  overrideAssistant?: {
    content: string;
  };
};

/**
 * Construct type from defined tool args and tool result data
 * @type `A = unknown` is for args
 * @type `T = unknown` is for data or tool result
 */
export type ExtendedToolResult<A = unknown, D = unknown> = {
  success: boolean;
  name: string;
  args: A;
  data: D;
};
