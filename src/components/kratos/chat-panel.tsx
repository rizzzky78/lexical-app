"use client";

import { AI } from "@/app/(server-action)/action-single";
import { UIState } from "@/lib/types/ai";
import { useAppState } from "@/lib/utility/provider/app-state";
import { generateId } from "ai";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { UserMessage } from "./user-message";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  CircleArrowUp,
  ImageIcon,
  Link,
  Loader,
  Paperclip,
  X,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useSmartTextarea } from "@/lib/hooks/useSmartTextArea";
import { useSetClipboard } from "@/lib/hooks/use-set-clipboard";
import { useDebounceInput } from "@/lib/hooks/use-debounce-input";

interface ChatPanelProps {
  uiState: UIState;
  query?: string;
}

type AttachBadgeProps = {
  attach: { id: string | number; title: string; link: string };
  onRemove: () => void;
};

function AttachBadge({ attach, onRemove }: AttachBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="flex w-full justify-between items-center gap-2 py-2 pl-5 rounded-3xl mb-1 bg-[#D8D2C2] hover:bg-[#D8D2C2] dark:bg-[#343131] dark:hover:bg-[#343131]"
    >
      <p className="line-clamp-1 text-xs font-normal">{attach.title}</p>
      <Button
        variant={"ghost"}
        className="rounded-full size-8 hover:bg-muted"
        onClick={onRemove}
      >
        <X className="size-4" />
      </Button>
    </Badge>
  );
}

export function ChatPanel({ uiState, query }: ChatPanelProps) {
  //
  // const [input, setInput] = useState("");
  const { input, attachment, setInput, detach, flush } = useSmartTextarea();
  const { value, isTyping, handleChange, handleBlur, handleReset } =
    useDebounceInput();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input) handleChange(input);
  }, [handleChange, input]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        500
      )}px`;
    }
  }, [value]);

  const [showEmptyScreen, setShowEmptyScreen] = useState<boolean>(false);
  //
  const [_uiState, setUIState] = useUIState<typeof AI>();
  const [_aiState, setAIState] = useAIState<typeof AI>();
  //
  const { isGenerating, setIsGenerating } = useAppState();
  //
  const { sendMessage } = useActions<typeof AI>();
  const { clipboard, setClipboard } = useSetClipboard();
  const [active, setActive] = useState(false);
  //

  const [isRemoved, setIsRemoved] = useState(false);

  //
  const router = useRouter();
  //
  const componentId = useId();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    setInput("");
    handleChange("");
    detach();
    setClipboard("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isGenerating) return;

    const f = new FormData();

    setIsGenerating(true);

    setUIState((prevUI) => [
      ...prevUI,
      {
        id: generateId(),
        display: <UserMessage key={componentId} content={value} />,
      },
    ]);

    if (attachment.meta) {
      f.set("attach_link", JSON.stringify(attachment));
    }

    if (!f.has("text_input")) {
      f.set("text_input", value);
    }

    flush();
    handleReset();

    const { id, display } = await sendMessage(f);

    setUIState((prevUI) => [...prevUI, { id, display }]);

    setIsGenerating(false);
  };

  const isButtonDisabled = isGenerating || value.length === 0;

  return (
    <div className="">
      <div className="fixed -bottom-4 w-full max-w-2xl z-20">
        <div className="w-full md:px-0 lg:px-0 max-w-[420px] lg:max-w-2xl flex flex-col pb-4 mb-0 rounded-t-3xl">
          {attachment.meta && (
            <div className="flex flex-wrap gap-1">
              <AttachBadge attach={attachment.meta} onRemove={handleRemove} />
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="relative w-full rounded-3xl bg-purple-200 dark:bg-muted flex flex-col px-2 pt-2 h-full"
          >
            <ScrollArea className="w-full rounded-3xl max-h-[500px] overflow-x-auto">
              <Textarea
                ref={textareaRef}
                name="text_input"
                className="resize-none active:border-transparent w-full border-transparent focus:border-none hover:border-none text-sm overflow-hidden"
                placeholder={
                  clipboard.length
                    ? "What information you want get from this product?"
                    : uiState.length
                    ? "Reply an follow up question"
                    : "What stuff are you wanted to search for?"
                }
                spellCheck={true}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    if (value.trim().length === 0) {
                      e.preventDefault();
                      return;
                    }
                    e.preventDefault();
                    const t = e.target as HTMLTextAreaElement;
                    t.form?.requestSubmit();
                  }
                }}
              />
            </ScrollArea>
            <div className="flex justify-between px-1 pb-2 -mt-3">
              <div className="flex items-center *:hover:bg-transparent *:bg-transparent">
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        className="text-[#4A4947] dark:text-white rounded-full *:hover:text-purple-500 *:dark:hover:text-purple-200"
                      >
                        <Paperclip className="h-6 w-6 hover:text-purple-200 -rotate-45" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-3xl">
                      <p>Attach some files</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        className="text-[#4A4947] dark:text-white rounded-full *:hover:text-purple-500 *:dark:hover:text-purple-200"
                      >
                        <ImageIcon className="h-6 w-6 hover:text-purple-200" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-3xl">
                      <p>Attach some images</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        className="text-[#4A4947] dark:text-white rounded-full *:hover:text-purple-500 *:dark:hover:text-purple-200"
                      >
                        <ChartNoAxesCombined className="h-6 w-6 hover:text-purple-200" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-3xl">
                      <p>Do trends research</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-[#4A4947] dark:text-white *:hover:bg-transparent *:bg-transparent *:hover:text-purple-500 *:dark:hover:text-purple-200">
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        className="cursor-pointer text-[#4A4947] dark:text-white rounded-full"
                        type={"submit"}
                        disabled={isButtonDisabled}
                      >
                        {isGenerating ? (
                          <Loader className="h-6 w-6 animate-spin" />
                        ) : (
                          <CircleArrowUp className="h-6 w-6" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-3xl">
                      <p>Send message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </form>
          <div className="pt-7 pb-1 text-xs flex justify-center bg-[#323232] text-white px-4 -z-10 relative -mt-6 rounded-b-3xl">
            <h3 className="">This app can make mistakes, use with concern.</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
