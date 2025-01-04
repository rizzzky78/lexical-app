"use client";

import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { UIState } from "@/lib/types/ai";
import { FC } from "react";

interface ChatMessagesProps {
  ui: UIState;
}

export const ChatMessages: FC<ChatMessagesProps> = ({ ui }) => {
  const [startRef, endRef] = useScrollToBottom<HTMLDivElement>();

  return (
    <div className="pb-10">
      <div>
        {ui.map((component) => (
          <div key={component.id}>{component.display}</div>
        ))}
        <div/>
      </div>
    </div>
  );
};
