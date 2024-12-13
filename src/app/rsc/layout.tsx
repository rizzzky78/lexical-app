import { ReactNode } from "react";
import { AI } from "../action";
import { generateId } from "ai";

export default function RSCLayout({ children }: { children: ReactNode }) {
  return (
    <AI initialAIState={{ chatId: generateId(), messages: [] }}>{children}</AI>
  );
}
