import React, { FC, memo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, SquareArrowOutUpRight } from "lucide-react";
import "katex/dist/katex.min.css";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
}

interface CodeBlockProps {
  language: string;
  value: string;
  className?: string;
}

const CodeBlock: FC<CodeBlockProps> = ({ language, value, className }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, [value]);

  return (
    <div className={cn("relative group rounded-lg overflow-hidden", className)}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        showLineNumbers
        customStyle={{
          margin: 0,
          width: "100%",
          background: "rgb(30, 30, 30)",
          padding: "1.5rem 1rem",
          borderRadius: "0.5rem",
        }}
        lineNumberStyle={{
          userSelect: "none",
          color: "rgb(100, 100, 100)",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.875rem",
            fontFamily: "var(--font-mono)",
            lineHeight: "1.7",
          },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const InlineCode: FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="px-1.5 py-0.5 rounded-md bg-gray-800 font-mono text-sm">
    {children}
  </code>
);

export const PureMarkdown: FC<MarkdownProps> = ({ children, className }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="scroll-m-20 text-sm font-bold tracking-tight mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="scroll-m-20 text-sm font-semibold tracking-tight mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="scroll-m-20 text-sm font-semibold tracking-tight mb-2">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="scroll-m-20 text-sm font-semibold tracking-tight mb-2">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-sm leading-7 [&:not(:first-child)]:mt-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="my-4 ml-6 list-disc [&>li]:mt-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
        ),
        li: ({ children }) => <li className="text-sm leading-7">{children}</li>,
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";
          const isInline = !match;

          return isInline ? (
            <InlineCode>{children}</InlineCode>
          ) : (
            <CodeBlock
              language={language}
              value={String(children).replace(/\n$/, "")}
              className="my-6"
            />
          );
        },
        table({ children }) {
          return (
            <div className="my-6 w-full overflow-y-auto">
              <table className="w-full border-collapse border border-gray-700">
                {children}
              </table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className="bg-gray-800">{children}</thead>;
        },
        tr({ children }) {
          return <tr className="border-b border-gray-700">{children}</tr>;
        },
        th({ children }) {
          return (
            <th className="border border-gray-700 px-4 py-2 text-left font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-gray-700 px-4 py-2">{children}</td>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="mt-4 border-l-4 border-gray-700 pl-4 italic">
            {children}
          </blockquote>
        ),
        a({ children, href }) {
          if (!href) return <>{children}</>;

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={href}
                    className="inline-flex text-sm items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                    <SquareArrowOutUpRight className="h-3 w-3" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 px-3 py-1.5">
                  {href}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      }}
      className={cn(
        "prose prose-invert max-w-none",
        "prose-headings:mb-4 prose-headings:font-semibold",
        "prose-p:leading-7",
        "prose-pre:p-0 prose-pre:bg-transparent",
        "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-gray-800",
        "prose-img:rounded-lg",
        className
      )}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  PureMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);
