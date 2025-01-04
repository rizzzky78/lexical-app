import { getChats } from "@/lib/agents/action/chat-service";
import { getServerSession, Session } from "next-auth";
import { cache } from "react";

const loadChats = cache(async (userId: string) => {
  return await getChats(userId);
});

export async function History({ session }: { session: Session | null }) {
  const chats = await getChats(session?.user?.email);
  return (
    <div>
      <div className="overflow-x-auto space-y-10 max-h-[70vh]">
        <h2>User Session</h2>
        <pre className="bg-gray-700">{JSON.stringify(session, null, 2)}</pre>
        <pre>{JSON.stringify(chats, null, 2)}</pre>
      </div>
    </div>
  );
}
