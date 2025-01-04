import { getChats } from "@/lib/agents/action/chat-service";
import { formatDateWithTime } from "@/lib/utility/date/root";
import { getServerSession, Session } from "next-auth";
import { cache, Suspense } from "react";

interface HistoryListProps {
  session: Session | null
}

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

export async function HistoryList({ session }: HistoryListProps) {
  const chats = await loadChats(session?.user?.email || "anonymous");

  return (
    <>
      {chats.map((chat) => (
        <div key={chat.chatId}>
          <a
            href="#"
            className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <div className="flex w-full items-center gap-2">
              <span>You</span>{" "}
              <span className="ml-auto text-xs">
                {formatDateWithTime(chat.created)}
              </span>
            </div>
            <span className="font-medium">You BY X</span>
            <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
              {chat.title}
            </span>
          </a>
        </div>
      ))}
    </>
  );
}
