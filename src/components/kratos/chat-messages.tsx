"use client";

import { SectionMessage } from "./section-message";

interface Message {
  role: "assistant" | "user" | "tool";
  content: string | MessageContent[];
}

interface MessageContent {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: {
    args: string;
  };
  result?: string;
}

interface ChatProps {
  chatId: string;
  messages: Message[];
}

export const ChatMessages: React.FC<ChatProps> = ({ chatId, messages }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Chat ID: {chatId}</h1>
      <div className="space-y-6">
        {messages.map((message, index) => (
          <SectionMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
      </div>
    </div>
  );
};
