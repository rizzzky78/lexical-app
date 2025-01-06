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

interface ChatPanelProps {
  uiState: UIState;
  query?: string;
}

const suggestedActions = [
  { title: "View all", label: "my cameras", action: "View all my cameras" },
  {
    title: "Search for",
    label: "Intel Arc GPU",
    action: "search for intel arc",
  },
  {
    title: "Search for",
    label: "acer nitro 5",
    action: "search for acer nitro 5",
  },
  {
    title: "Search for",
    label: "poco x6",
    action: "search for poco x6",
  },
];

type PatternBadgeProps = {
  pattern: { type: "url"; title: string; value: string; expanded: boolean };
  onRemove: () => void;
};

function PatternBadge({ pattern, onRemove }: PatternBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="flex w-full justify-between items-center gap-2 py-2 pl-5 rounded-3xl mb-1"
    >
      <p className="line-clamp-1 text-xs">{pattern.title}</p>
      <Button
        variant={"ghost"}
        className="rounded-full size-8"
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
  const { input, setInput, patterns, processInput, removePattern } =
    useSmartTextarea();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        500
      )}px`;
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  const [showEmptyScreen, setShowEmptyScreen] = useState<boolean>(false);
  //
  const [_uiState, setUIState] = useUIState<typeof AI>();
  const [_aiState, setAIState] = useAIState<typeof AI>();
  //
  const { isGenerating, setIsGenerating } = useAppState();
  //
  const { sendMessage } = useActions<typeof AI>();
  const { clipboard, setClipboard } = useSetClipboard();
  //

  useEffect(() => {
    if (clipboard && clipboard.length > 0) processInput(clipboard);
  }, [clipboard, processInput]);

  //
  const router = useRouter();
  //
  const componentId = useId();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isGenerating) return;

    setIsGenerating(true);

    setUIState((prevUI) => [
      ...prevUI,
      {
        id: generateId(),
        display: <UserMessage key={componentId} content={input} />,
      },
    ]);

    const f = new FormData();
    if (!f.has("text_input")) {
      f.set("text_input", input);
    }

    setInput("");
    //
    const { id, display, stream } = await sendMessage(f);
    //
    setUIState((prevUI) => [...prevUI, { id, display }]);

    setIsGenerating(false);
  };

  const handleActionSubmit = async (action: string) => {
    setIsGenerating(true);

    setUIState((messages) => [
      ...messages,
      {
        id: generateId(),
        display: <UserMessage key={componentId} content={action} />,
      },
    ]);

    const f = new FormData();

    f.append("text_input", action);

    const { id, display } = await sendMessage(f);

    setUIState((messages) => [...messages, { id, display }]);

    setIsGenerating(false);
  };

  return (
    <div className="">
      <div className="fixed -bottom-4 w-full max-w-2xl">
        <div className="w-full md:px-0 lg:px-0 max-w-[420px] lg:max-w-2xl flex flex-col pb-4 mb-0 rounded-t-3xl">
          {patterns.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {patterns.map((pattern, idx) => (
                <PatternBadge
                  key={idx}
                  pattern={pattern}
                  onRemove={() => {
                    removePattern(idx);
                    setInput("");
                    setClipboard("");
                  }}
                />
              ))}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="relative w-full rounded-3xl bg-[#D8D2C2] dark:bg-muted flex flex-col px-2 p-2 h-full"
          >
            <ScrollArea className="w-full rounded-3xl min-h-[40px] max-h-[500px] overflow-x-auto">
              <Textarea
                ref={textareaRef}
                name="text_input"
                placeholder={
                  clipboard.length
                    ? "What information you want get from this product?"
                    : uiState.length
                    ? "Reply an follow up question"
                    : "What stuff are you wanted to search for?"
                }
                spellCheck={false}
                value={input}
                onChange={(e) => processInput(e.target.value)}
                className="resize-none active:border-transparent w-full border-transparent focus:border-none hover:border-none text-sm overflow-hidden"
              />
            </ScrollArea>
            <div className="flex justify-between p-1">
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
          <div className="pt-7 pb-1 text-xs flex justify-center bg-background px-4 -z-10 relative -mt-6">
            <h3 className="">
              This app can make mistakes, use with concern.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
