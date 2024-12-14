"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUIState } from "ai/rsc";
import { ChatMessages } from "./chat-messages";
import { AI } from "@/app/action";
import { ChatPanel } from "./chat-panel";

type ChatProps = {
  id?: string;
  query?: string;
};

export function Chat({ id, query }: ChatProps) {
  const path = usePathname();
  const [messages] = useUIState<typeof AI>();

  useEffect(() => {
    if (!path.includes(`rsc/c/`) && messages.length === 1) {
      window.history.replaceState({}, "", `/rsc/c/${id}`);
    }
  }, [id, path, query, messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <ChatMessages messages={messages} />
      <ChatPanel messages={messages} query={query} chatid={id} />
    </div>
  );
}
