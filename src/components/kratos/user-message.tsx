"use client";

import { useState } from "react";
import { Markdown } from "./markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-end mb-4">
      <div className="bg-[#343131] w-fit max-w-[90%] py-3 px-5 rounded-[2rem]">
        <div className="group relative">
          <Markdown className="whitespace-pre-wrap text-white">
            {content}
          </Markdown>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute rounded-full text-white h-8 w-1 -bottom-8 right-3 bg-[#1A1A1D] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check /> : <Copy />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
