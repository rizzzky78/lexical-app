"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUIState } from "ai/rsc";
import { ChatMessages } from "./chat-messages";
import { AI } from "@/app/(server-action)/action-single";

type ChatProps = {
  id?: string;
  query?: string;
};

export function Chat({ id, query }: ChatProps) {
  const path = usePathname();
  const [uiMessage] = useUIState<typeof AI>();

  useEffect(() => {
    if (!path.includes(`chat/c/`) && uiMessage.length === 1) {
      window.history.replaceState({}, "", `/chat/c/${id}`);
    }
  }, [id, path, query, uiMessage]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto pt-20 px-4">
      <ChatMessages ui={uiMessage} />
      <ChatPanel messages={messages} query={query} chatid={id} />
    </div>
  );
}
