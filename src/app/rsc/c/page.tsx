import { generateId } from "ai";
import { AI } from "@/app/action";
import { redirect } from "next/navigation";
import { Chat } from "@/components/kratos/main/chat";

export const maxDuration = 60;

export default function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  if (!searchParams.q) {
    redirect("/rsc");
  }
  const id = generateId();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} query={searchParams.q} />
    </AI>
  );
}
