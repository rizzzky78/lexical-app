"use client";

import { FC, useEffect, useState } from "react";
import { Markdown } from "../markdown";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AssistantMessageProps {
  content: StreamableValue<string>;
  className?: string;
}

export const AssistantMessage: FC<AssistantMessageProps> = ({
  content,
  className = "",
}) => {
  const [data, error, pending] = useStreamableValue(content);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (data) setText(data);
  }, [data]);

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load message!</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`${className}`}>
      {text.length > 0 ? (
        <Markdown>{text}</Markdown>
      ) : (
        <div className="space-y-3 relative transition-all duration-200 ">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
    </div>
  );
};
