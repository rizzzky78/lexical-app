"use client";

import { UIState } from "@/lib/types/ai";
import { FC } from "react";

interface ChatMessagesProps {
  ui: UIState;
}

export const ChatMessages: FC<ChatMessagesProps> = ({ ui }) => {
  return (
    <div>
      {ui.map((component) => (
        <div key={component.id}>{component.display}</div>
      ))}
    </div>
  );
};
