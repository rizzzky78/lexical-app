"use client";

import { useEffect, useState } from "react";
import { Markdown } from "./markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { toast } from "sonner";

interface UserMessageProps {
  content: string;
}

export function AssistantMessage({ content }: UserMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    toast("Copied Successfully!", {
      position: "top-center",
      richColors: true,
      className:
        "text-xs flex justify-center rounded-3xl border-none text-white dark:text-black bg-[#1A1A1D] dark:bg-white",
    });
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-start mb-4 py-7">
      <div className="w-full py-3 px-5 rounded-[2rem]">
        <div className="group relative">
          <Markdown className="selection:bg-purple-200 selection:text-black">
            {content}
          </Markdown>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute rounded-full text-white h-8 w-1 -bottom-8 left-3 bg-[#1A1A1D] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check /> : <Copy />}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-3xl">
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

interface StreamUserMessageProps {
  content: StreamableValue<string>;
}

export function StreamAssistantMessage({ content }: StreamUserMessageProps) {
  const [copied, setCopied] = useState(false);

  const [data, error, pending] = useStreamableValue(content);
  const [contentText, setContentText] = useState<string>("");

  useEffect(() => {
    if (data) setContentText(data);
  }, [data]);

  const copyToClipboard = () => {
    toast("Copied Successfully!", {
      position: "top-center",
      richColors: true,
      className:
        "text-xs flex justify-center rounded-3xl border-none text-white dark:text-black bg-[#1A1A1D] dark:bg-white",
    });
    navigator.clipboard.writeText(contentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-start mb-4 py-5">
      <div className="w-full py-3 px-5 rounded-[2rem]">
        <div className="group relative">
          <Markdown className="selection:bg-purple-200 selection:text-black">
            {contentText}
          </Markdown>
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute rounded-full text-white h-8 w-1 -bottom-8 left-3 bg-[#1A1A1D] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check /> : <Copy />}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-3xl">
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
