import { CoreMessage } from "ai";
import { ReactNode } from "react";
import { FunctionToolsName } from "../agents/tools/root";

export type ChatProperties = {
  id: string;
  title: string;
  created: Date;
  userId: string;
  messages: MessageProperty[];
  sharePath?: string;
  modelUsed: string;
} & Record<string, any>;

export type UIState = {
  id: string;
  component: ReactNode;
}[]

export type AIState = {
  chatId: string;
  messages: MessageProperty[];
  isSharedPage?: boolean;
};

export type UserMessageType =
  | "text_input"
  | "related_input"
  | "inquiry_input"
  | "skip"
  | "attachment"
  | "quiz_answer_choice"
  | "quiz_next_input";

export type AssistantMessageType =
  | "answer"
  | "related"
  | "followup-panel"
  | "markdown"
  | "tool"
  | "end";

export type MessageProperty = {
  id: string;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  toolName?: FunctionToolsName | ({} & string);
  messageType?: UserMessageType | AssistantMessageType;
  content: CoreMessage["content"];
};

export type ActionsType = "sendMessage" | "streamMessage";

export type UseAction = {
  submitMessage: (
    payload: SubmitMessagePayload
  ) => Promise<{ id: string; component: ReactNode }>;
};

export type SubmitMessagePayload = {
  message: CoreMessage;
  userId: string;
  model: string;
  messageType: UserMessageType;
  enableRelated?: {
    scopeRelated?: "last-message" | "overall";
  };
};
