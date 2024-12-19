"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { motion } from "framer-motion";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { AIMessage } from "@/components/kratos/ai-message";
import { RootAI } from "../root-action";

export default function Home() {
  const { sendMessage } = useActions<typeof RootAI>();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    { title: "Who is", label: "Joko widodo?", action: "who is joko widodo?" },
    {
      title: "Show me",
      label: "my smart home hub",
      action: "Show me my smart home hub",
    },
    {
      title: "How much",
      label: "electricity have I used this month?",
      action: "Show electricity usage",
    },
    {
      title: "How much",
      label: "water have I used this month?",
      action: "Show water usage",
    },
  ];

  return (
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
      <div className="px-10">
        {messages.map((message) => message)}

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={async (event) => {
            event.preventDefault();

            setMessages((messages) => [
              ...messages,
              <AIMessage key={messages.length} role="user" content={input} />,
            ]);
            setInput("");

            const response: ReactNode = await sendMessage([
              {
                role: "user",
                content: input,
              },
            ]);
            setMessages((messages) => [...messages, response]);
          }}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300  max-w-[calc(100dvw-32px)]"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
}
