'use client'

import { FC, useEffect, useState } from "react";
import { Markdown } from "../markdown";
import { StreamableValue, useStreamableValue } from "ai/rsc";

interface AssistantMessageProps {
  content: StreamableValue<string>;
}

export const AssistantMessage: FC<AssistantMessageProps> = ({ content }) => {
  const [data, error, pending] = useStreamableValue(content);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (data) setText(data);
  }, [data]);

  return (
    <div className="bg-red-500">
      <Markdown>{text}</Markdown>
    </div>
  );
};
