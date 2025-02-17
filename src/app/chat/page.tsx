import { cache, FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { AI } from "../(server-action)/action-single";
import { Chat } from "@/components/kratos/chat";
import { getServerSession } from "next-auth";
import { getChats } from "@/lib/agents/action/chat-service";

export const maxDuration = 60;

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

const ChatPage: FC = async () => {
  const id = uuidv4();
  const session = await getServerSession();

  const chats = await loadChats(session?.user?.email || "anonymous");

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} chats={chats} />
    </AI>
  );
};

export default ChatPage;
