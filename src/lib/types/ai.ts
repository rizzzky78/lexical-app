import { CoreMessage } from "ai";
import { ReactNode } from "react";
import { FunctionToolsName } from "../agents/tools/root";

export type ChatProperties = {
  chatId: string;
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
}[];

export type AIState = {
  chatId: string;
  messages: MessageProperty[];
  isSharedPage?: boolean;
};

export type UserMessageType =
  | "text_input"
  | "text_input_attachment"
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
  | "inquiry"
  | "markdown"
  | "tool"
  | "end";

export type MessageProperty = {
  id: string;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  toolName?: FunctionToolsName | ({} & string);
  messageType: UserMessageType | AssistantMessageType;
  content: CoreMessage["content"];
};

export type ActionsType = "sendMessage" | "streamMessage";

export type UseAction = {
  submitMessage: (
    payload: SubmitMessagePayload
  ) => Promise<{ id: string; component: ReactNode }>;
};

export type SubmitMessagePayload = {
  /**
   * The Core Message, it can be form of:
   * - user message with text/attachment
   * - assistant message
   * - tool message or tool result with serializable content JSON value
   */
  message: CoreMessage;
  /**
   * The owner or the user id
   */
  userId: string;
  /**
   * The AI model used
   */
  model: string;
  /**
   * Messsage type accros various funtion to map the UI
   */
  messageType: UserMessageType;
  /**
   * Classify whether each new user prompt is needed to classified first or not.
   *
   * If the option is `true` then it should inquire user to advance the next process.
   * @default true
   */
  classify?: boolean;
  /**
   * The scope of sub-agentic tools
   */
  scope: {
    /**
     * The scope of context to craft the inquiry data.
     * - `current` means only refers to current or last user message
     * - `global` means refers to whole conversation
     */
    inquire?: "current" | "global";
    /**
     * The scope of context to craft the related query data.
     * - `current` means only refers to current or last user message
     * - `global` means refers to whole conversation
     */
    related?: "last-message" | "overall";
    /**
     * The scope of context to run task manager as well as make the LLM understand the context of current conversaion.
     * - `current` means only refers to current or last user message
     * - `global` means refers to whole conversation
     */
    taskManager?: "current" | "global";
  };
};
