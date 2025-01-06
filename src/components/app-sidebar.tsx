"use client";

import * as React from "react";
import { Atom, CirclePlus } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";
import { ChatProperties } from "@/lib/types/ai";
import { HistoryItem } from "./kratos/history-item";
import { Button } from "./ui/button";
import { useAppState } from "@/lib/utility/provider/app-state";
import { useAIState, useUIState } from "ai/rsc";
import { AI } from "@/app/(server-action)/action-single";
import { useRouter } from "next/navigation";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session | null;
  chats: ChatProperties[];
}

export function AppSidebar({ chats, session, ...props }: AppSidebarProps) {
  const user = {
    name: session?.user?.name as string,
    email: session?.user?.email as string,
    avatar: session?.user?.image as string,
  };

  const { isGenerating, setIsGenerating } = useAppState();
  const [_ui, setUIState] = useUIState<typeof AI>();
  const [_ai, setAIState] = useAIState<typeof AI>();

  const router = useRouter();

  const handleClear = () => {
    setIsGenerating(false);
    setUIState([]);
    setAIState({ chatId: "", messages: [] });
    router.push("/chat");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center pb-1 justify-between">
            <div className="flex items-center space-x-2">
              <Atom /> <span>Lexical App</span>
            </div>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="rounded-full"
              onClick={handleClear}
              disabled={isGenerating}
            >
              <CirclePlus />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pr-2 scrollbar-thin">
        {chats.map((chat, idx) => (
          <HistoryItem key={idx} chat={chat} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
