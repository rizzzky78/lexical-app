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
