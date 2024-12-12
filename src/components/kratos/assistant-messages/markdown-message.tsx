import { FC } from "react";
import Markdown from "react-markdown";

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: FC<MarkdownMessageProps> = ({ content }) => {
  return (
    <div>
      <Markdown>{content}</Markdown>
    </div>
  );
};
