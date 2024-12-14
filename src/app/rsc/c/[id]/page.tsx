import { notFound, redirect } from "next/navigation";
import { AI } from "@/app/action";
import { getServerSession } from "next-auth";
import { Chat } from "@/components/kratos/main/chat";
import { getChat } from "@/lib/agents/action/chat-service";

export const maxDuration = 60;

export interface SearchPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SearchPageProps) {
  const chat = await getChat(params.id);
  return {
    title: chat?.title.toString().slice(0, 50) || "Search",
  };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const session = await getServerSession();

  const userId = session?.user?.email as string;
  const chat = await getChat(params.id);

  if (!chat) {
    redirect("/rsc");
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
      <Chat id={params.id} />
    </AI>
  );
}
