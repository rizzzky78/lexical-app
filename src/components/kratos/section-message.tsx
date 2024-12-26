"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BaseMessageProps {
  children: ReactNode;
  isUser?: boolean;
  className?: string;
}

export const BaseMessage = ({
  children,
  isUser = false,
  className,
}: BaseMessageProps) => {
  return (
    <motion.div
      className={cn(
        "flex py-3 gap-4 w-full md:px-0 first-of-type:pt-20",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div
        className={cn(
          "flex flex-col gap-1 w-full",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 p-3 rounded-xl",
            className
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const SectionAssistantMessage = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <BaseMessage>{children}</BaseMessage>;
};

export const SectionToolMessage = ({ children }: { children: ReactNode }) => {
  return (
    <BaseMessage className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700">
      {children}
    </BaseMessage>
  );
};

export const SectionUserMessage = ({ children }: { children: ReactNode }) => {
  return (
    <BaseMessage isUser className="bg-blue-100 dark:bg-blue-900">
      {children}
    </BaseMessage>
  );
};

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

export const SectionMessage = ({
  role,
  content,
}: {
  role: "assistant" | "user" | "tool";
  content: string | MessageContent[];
}) => {
  const renderContent = (content: string | MessageContent[]): ReactNode => {
    if (typeof content === "string") {
      return <p className="w-full">{content}</p>;
    }

    return content.map((item, index) => {
      switch (item.type) {
        case "text":
          return (
            <div key={index} className="whitespace-pre-wrap">
              {item.text}
            </div>
          );
        case "tool-call":
          return (
            <div key={index} className="text-sm text-zinc-500">
              Tool called: {item.toolName} (ID: {item.toolCallId})
              <br />
              Args: {JSON.stringify(item.args)}
            </div>
          );
        case "tool-result":
          if (item.toolName === "searchProduct") {
            const products = JSON.parse(item.result!).data;
            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {products.map((product: any, productIndex: number) => (
                  <div key={productIndex}>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(product, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            );
          }
          return (
            <pre
              key={index}
              className="bg-zinc-100 overflow-x-auto dark:bg-zinc-800 p-2 rounded-md"
            >
              {JSON.stringify(JSON.parse(item.result!), null, 2)}
            </pre>
          );
        default:
          return null;
      }
    });
  };

  switch (role) {
    case "assistant":
      return (
        <SectionAssistantMessage>
          {renderContent(content)}
        </SectionAssistantMessage>
      );
    case "user":
      return <SectionUserMessage>{renderContent(content)}</SectionUserMessage>;
    case "tool":
      return <SectionToolMessage>{renderContent(content)}</SectionToolMessage>;
    default:
      return null;
  }
};
