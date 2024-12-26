"use client";

import { FormEvent, useRef, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { motion } from "framer-motion";
import Link from "next/link";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Airplay, Aperture } from "lucide-react";
import { Message } from "@/components/kratos/testing/message";
import { AI } from "../(server-action)/action-single";
import { useAppState } from "@/lib/utility/provider/app-state";
import { generateId } from "ai";

export default function Home() {
  const { sendMessage } = useActions<typeof AI>();
  const [uiState, setUIState] = useUIState<typeof AI>();

  const { isGenerating, setIsGenerating } = useAppState();

  const [input, setInput] = useState<string>("");

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

  const handleActionSubmit = async (action: string) => {
    setIsGenerating(true);

    setUIState((messages) => [
      ...messages,
      {
        id: generateId(),
        display: (
          <Message key={messages.length} role="user">
            {action}
          </Message>
        ),
      },
    ]);

    const f = new FormData();

    f.append("text_input", action);

    const { id, display } = await sendMessage(f);

    setUIState((messages) => [...messages, { id, display }]);

    setIsGenerating(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsGenerating(true);

    setUIState((messages) => [
      ...messages,
      {
        id: generateId(),
        display: (
          <Message key={messages.length} role="user">
            {input}
          </Message>
        ),
      },
    ]);

    const f = new FormData();

    f.append("text_input", input);

    setInput("");

    const { id, display } = await sendMessage(f);

    setUIState((messages) => [...messages, { id, display }]);

    setIsGenerating(false);
  };

  return (
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
      <div className="">
        <div ref={messagesContainerRef} className="">
          {uiState.length === 0 && (
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
          {/* {messages.map((message) => message)} */}
          {uiState.map((v) => v.display)}
          <div ref={messagesEndRef} />
        </div>

        {uiState.length === 0 && (
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
                  onClick={async () => await handleActionSubmit(action.action)}
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
          onSubmit={handleSubmit}
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
