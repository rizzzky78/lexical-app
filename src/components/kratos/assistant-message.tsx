"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Markdown } from "./markdown";

interface AssistantMessageProps {
  content: string;
}

export default function AssistantMessage({ content }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = () => {
    return () => {
      navigator.clipboard.writeText(content);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear any existing timeout
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null; // Clean up ref
      }, 2000);
    };
  };

  return (
    <div className="flex items-start space-x-2">
      <div className="flex-grow text-[#343131]">
        <Markdown>{content}</Markdown>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="text-[#343131] hover:text-[#1A1A1D] hover:bg-[#FFF0DC]"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
