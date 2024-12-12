import { FC } from "react";
import { Markdown } from "../markdown";

interface AssistantMessageProps {
  content: string;
}

export const AssistantMessage: FC<AssistantMessageProps> = ({ content }) => {
  return (
    <div>
      <Markdown>{content}</Markdown>
    </div>
  );
};
