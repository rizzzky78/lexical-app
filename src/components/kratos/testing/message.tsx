"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { BotMessageSquare, CircleUserRound } from "lucide-react";
import { Markdown } from "../markdown";
import { cn } from "@/lib/utils";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue<string>;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className={`flex flex-row gap-2 w-full md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <BotMessageSquare />
      </div>

      <div className="flex flex-col w-full">
        <div
          className={cn(
            "text-white p-6 rounded-xl bg-[#343131] flex flex-col gap-4",
            text ? "" : "animate-pulse"
          )}
        >
          <Markdown>{text!}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  children,
}: {
  role: "assistant" | "user";
  children: ReactNode;
}) => {
  const isAssistant = role === "assistant";
  return (
    <motion.div
      className={cn(
        "flex py-3 gap-2 w-full md:px-0 first-of-type:pt-20",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <BotMessageSquare /> : <CircleUserRound />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
