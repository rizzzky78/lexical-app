import { getChats } from "@/lib/agents/action/chat-service";
import { getServerSession, Session } from "next-auth";
import { cache } from "react";

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

export default async function Page() {
  const session = await getServerSession();
  const chats = await getChats(session?.user?.email || "anonymous");
  return (
    <div>
      <div className="overflow-x-auto space-y-10">
        <h2>User Session</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <pre>{JSON.stringify(chats, null, 2)}</pre>
      </div>
    </div>
  );
}
