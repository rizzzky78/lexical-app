"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUIState, useActions, useAIState } from "ai/rsc";
import { cn } from "@/lib/utils";
import { UserMessage } from "./user-message";
import { ArrowRight, Plus } from "lucide-react";
import Textarea from "react-textarea-autosize";
import { generateId } from "ai";
import { toast } from "sonner";
import { UIState } from "@/lib/types/ai";
import { AI } from "@/app/(server-action)/action-single";
import { useAppState } from "@/lib/utility/provider/app-state";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { Button } from "../ui/button";

interface ChatPanelProps {
  messages: UIState;
  query?: string;
  onModelChange?: (id: string) => void;
}

export function XChatPanel({ messages, query, onModelChange }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);
  const [, setMessages] = useUIState<typeof AI>();
  const [aiMessage, setAIMessage] = useAIState<typeof AI>();
  const { isGenerating, setIsGenerating } = useAppState();
  const { submit } = useActions();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true); // For development environment

  const [selectedModelId, setSelectedModelId] = useLocalStorage<string>(
    "selectedModel",
    ""
  );

  const [isComposing, setIsComposing] = useState(false); // Composition state
  const [enterDisabled, setEnterDisabled] = useState(false); // Disable Enter after composition ends

  const handleCompositionStart = () => setIsComposing(true);

  const handleCompositionEnd = () => {};

  async function handleQuerySubmit(query: string, formData?: FormData) {}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await handleQuerySubmit(input, formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`${error}`);
    }
  };

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0) {
    return (
      <div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center items-center mx-auto pointer-events-none">
        <Button
          type="button"
          variant={"secondary"}
          className="rounded-full bg-secondary/80 group transition-all hover:scale-105 pointer-events-auto"
          disabled={isGenerating}
        >
          <span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
            New
          </span>
          <Plus size={18} className="group-hover:rotate-90 transition-all" />
        </Button>
      </div>
    );
  }

  if (query && query.trim().length > 0) {
    return null;
  }

  return (
    <div
      className={
        "fixed bottom-8 left-0 right-0 top-10 mx-auto h-screen flex flex-col items-center justify-center"
      }
    >
      <form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
        <div className="relative flex items-center w-full">
          <Textarea
            ref={inputRef}
            name="input"
            rows={1}
            maxRows={5}
            tabIndex={0}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Ask a question..."
            spellCheck={false}
            value={input}
            className="resize-none w-full min-h-12 rounded-fill bg-muted border border-input pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              setInput(e.target.value);
              setShowEmptyScreen(e.target.value.length === 0);
            }}
            onKeyDown={(e) => {
              // Enter should submit the form, but disable it right after IME input confirmation
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !isComposing && // Not in composition
                !enterDisabled // Not within the delay after confirmation
              ) {
                // Prevent the default action to avoid adding a new line
                if (input.trim().length === 0) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                textarea.form?.requestSubmit();
              }
            }}
            onHeightChange={(height) => {
              // Ensure inputRef.current is defined
              if (!inputRef.current) return;

              // The initial height and left padding is 70px and 2rem
              const initialHeight = 70;
              // The initial border radius is 32px
              const initialBorder = 32;
              // The height is incremented by multiples of 20px
              const multiple = (height - initialHeight) / 20;

              // Decrease the border radius by 4px for each 20px height increase
              const newBorder = initialBorder - 4 * multiple;
              // The lowest border radius will be 8px
              inputRef.current.style.borderRadius =
                Math.max(8, newBorder) + "px";
            }}
            onFocus={() => setShowEmptyScreen(true)}
            onBlur={() => setShowEmptyScreen(false)}
          />
          <Button
            type="submit"
            size={"icon"}
            variant={"ghost"}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={input.length === 0}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        <EmptyScreen
          submitMessage={(message) => {
            setInput(message);
          }}
          className={cn(showEmptyScreen ? "visible" : "invisible")}
        />
      </form>
    </div>
  );
}

const exampleMessages = [
  {
    heading: "What is OpenAI o1?",
    message: "What is OpenAI o1?",
  },
  {
    heading: "Why is Nvidia growing rapidly?",
    message: "Why is Nvidia growing rapidly?",
  },
  {
    heading: "Tesla vs Rivian",
    message: "Tesla vs Rivian",
  },
  {
    heading: "Summary: https://arxiv.org/pdf/2407.16833",
    message: "Summary: https://arxiv.org/pdf/2407.16833",
  },
];
export function EmptyScreen({
  submitMessage,
  className,
}: {
  submitMessage: (message: string) => void;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
