"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";
import { BotIcon, UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Markdown } from "./markdown";
import { FC, ReactNode, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue<string>;
}) => {
  const [text] = useStreamableValue(content);

  const [data, error, pending] = useStreamableValue(content);
  const [contentString, setContent] = useState<string>("");

  useEffect(() => {
    if (data) setContent(data);
  }, [data]);

  return (
    <div
      className={`flex flex-row gap-4 px-4 w-full md:px-0 first-of-type:pt-20`}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          <Markdown>{text!}</Markdown>
        </div>
      </div>
    </div>
  );
};

export const AIMessage = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          {content}
        </div>
      </div>
    </motion.div>
  );
};

interface AnswerProps {
  text: StreamableValue<string>;
}

export const AnswerSection: FC<AnswerProps> = ({ text }) => {
  const [data, error, pending] = useStreamableValue(text);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (!data) return;
    setContent(data);
  }, [data]);

  if (error) {
    return (
      <div>
        <pre>An Error Occured!</pre>
      </div>
    );
  }

  return (
    <div>
      {content.length > 0 ? (
        <div>
          <p>{content}</p>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
