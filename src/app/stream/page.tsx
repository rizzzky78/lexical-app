"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { motion } from "framer-motion";
import Link from "next/link";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Airplay, Aperture } from "lucide-react";
import { Message } from "@/components/kratos/testing/message";
import { AI, SendMessageCallback } from "../(server-action)/action-single";

export default function Home() {
  const { sendMessage } = useActions<typeof AI>();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    { title: "View all", label: "my cameras", action: "View all my cameras" },
    {
      title: "Search for",
      label: "Intel Arc GPU",
      action: "search for intel arc",
    },
    {
      title: "Search for",
      label: "acer nitro 5",
      action: "search for acer nitro 5",
    },
    {
      title: "Search for",
      label: "poco x6",
      action: "search for poco x6",
    },
  ];

  return (
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
      <div className="">
        <div ref={messagesContainerRef} className="">
          {messages.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full md:px-0 pt-20">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <Aperture />
                  <span>+</span>
                  <Airplay />
                </p>
                <p>
                  The streamUI function allows you to stream React Server
                  Components along with your language model generations to
                  integrate dynamic user interfaces into your application.
                </p>
                <p>
                  {" "}
                  Learn more about the{" "}
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://sdk.vercel.ai/docs/ai-sdk-rsc/streaming-react-components"
                    target="_blank"
                  >
                    streamUI
                  </Link>
                  <span>hook from Vercel AI SDK.</span>
                </p>
              </div>
            </motion.div>
          )}
          {messages.map((message) => message)}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-2 w-full max-w-2xl px-4 md:px-0 mx-auto mb-4">
            {suggestedActions.map((action, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    setMessages((messages) => [
                      ...messages,
                      <Message
                        key={messages.length}
                        role="user"
                        content={action.action}
                      />,
                    ]);
                    const f = new FormData();

                    f.append("text_input", action.action);

                    const { value }: SendMessageCallback = await sendMessage(f);

                    setMessages((messages) => [...messages, value]);
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={async (event) => {
            event.preventDefault();

            setMessages((messages) => [
              ...messages,
              <Message key={messages.length} role="user" content={input} />,
            ]);

            const f = new FormData();

            f.append("text_input", input);

            setInput("");

            const { value }: SendMessageCallback = await sendMessage(f);

            setMessages((messages) => [...messages, value]);
          }}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
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
