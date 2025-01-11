import { generateId } from "ai";
import { redirect } from "next/navigation";
import { Chat } from "@/components/kratos/chat";
import { AI } from "@/app/(server-action)/action-single";
import { getServerSession } from "next-auth";
import { cache } from "react";
import { getChats } from "@/lib/agents/action/chat-service";
import { v4 } from "uuid";

export const maxDuration = 60;

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

export default async function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  if (!searchParams.q) {
    redirect("/chat");
  }
  const id = v4();
  const session = await getServerSession();

  const chats = await loadChats(session?.user?.email || "anonymous");

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} query={searchParams.q} session={session} chats={chats} />
    </AI>
  );
}
