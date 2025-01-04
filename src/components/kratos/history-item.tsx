import { useSetChatTitle } from "@/lib/hooks/useSetChat";
import { ChatProperties } from "@/lib/types/ai";
import Link from "next/link";
import { FC } from "react";

interface HistoryItemProps {
  chat: ChatProperties;
}

export const HistoryItem: FC<HistoryItemProps> = ({ chat }) => {
  const { setChatTitle } = useSetChatTitle();
  return (
    <Link
      href={`/chat/c/${chat.chatId}`}
      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-3 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      onClick={() => setChatTitle(chat.title)}
    >
      <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
        {chat.title}
      </span>
    </Link>
  );
};
