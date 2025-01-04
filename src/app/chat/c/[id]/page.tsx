import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Chat } from "@/components/kratos/chat";
import { getChat, getChats } from "@/lib/agents/action/chat-service";
import { AI } from "@/app/(server-action)/action-single";
import { cache } from "react";

export const maxDuration = 60;

export interface SearchPageProps {
  params: {
    id: string;
  };
}

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const chat = await getChat(id);
  return {
    title: chat?.title.toString().slice(0, 50) || "Search",
  };
}

export default async function SearchPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const session = await getServerSession();
  const chats = await loadChats(session?.user?.email || "anonymous");

  const userId = session?.user?.email as string;
  const chat = await getChat(id);

  if (!chat) {
    redirect("/chat");
  }

  if (chat?.userId !== userId) {
    notFound();
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages,
      }}
    >
      <Chat id={id} session={session} chats={chats} />
    </AI>
  );
}
