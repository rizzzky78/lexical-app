"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUIState } from "ai/rsc";
import { ChatMessages } from "./chat-messages";
import { AI } from "@/app/(server-action)/action-single";
import { ChatPanel } from "./chat-panel";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";
import { ChatProperties } from "@/lib/types/ai";
import { useSetChatTitle } from "@/lib/hooks/useSetChat";

type ChatProps = {
  id?: string;
  query?: string;
  session: Session | null;
  chats: ChatProperties[];
};

export function Chat({ id, query, session, chats }: ChatProps) {
  const path = usePathname();
  const [uiMessage] = useUIState<typeof AI>();
  const { chatTitle } = useSetChatTitle();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!path.includes(`chat/c/`) && uiMessage.length === 1) {
      window.history.replaceState({}, "", `/chat/c/${id}`);
    }
  }, [id, path, query, uiMessage]);

  const handleSidebarOpen = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar session={session} chats={chats} />
      <SidebarInset>
        <header className="sticky z-20 top-0 flex shrink-0 items-center gap-2 bg-background/80 backdrop-blur-sm py-1 px-4">
          <SidebarTrigger onClick={handleSidebarOpen} className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-8" />
          <div>
            <p className="text-sm">{chatTitle}</p>
          </div>
        </header>
        <div>
          <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
            <ChatMessages ui={uiMessage} />
          </div>
          <ChatPanel
            isSidebarOpen={isSidebarOpen}
            messages={uiMessage}
            query={query}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
