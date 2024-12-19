import React, { FC, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { SquareArrowOutUpRight } from "lucide-react";

interface NonMemoizedMarkdownProps {
  children: string;
}

export const NonMemoizedMarkdown: FC<NonMemoizedMarkdownProps> = ({
  children,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-xl font-bold mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-sm font-semibold mb-2">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-xs font-semibold mb-2">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-xs font-semibold mb-2">{children}</h6>
        ),
        p: ({ children }) => (
          <p className="text-sm mb-2 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="text-sm list-disc list-inside mb-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="text-sm list-decimal list-inside mb-2">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";
          const isInline = !match;
          return isInline ? (
            <code className={`${className} text-xs`} {...props}>
              {children}
            </code>
          ) : (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={language}
              PreTag="div"
              showLineNumbers
              customStyle={{
                margin: 0,
                width: "100%",
                background: "transparent",
                padding: "1.5rem 1rem",
              }}
              lineNumberStyle={{
                userSelect: "none",
              }}
              codeTagProps={{
                style: {
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-mono)",
                },
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
        table({ children, ...props }) {
          return (
            <table className="border-collapse w-full my-4" {...props}>
              {children}
            </table>
          );
        },
        thead({ children, ...props }) {
          return (
            <thead className="dark:text-white" {...props}>
              {children}
            </thead>
          );
        },
        tr({ children, ...props }) {
          return (
            <tr className="border-b" {...props}>
              {children}
            </tr>
          );
        },
        th({ children, ...props }) {
          return (
            <th
              className="border dark:border-white border-black px-4 py-2 text-left"
              {...props}
            >
              {children}
            </th>
          );
        },
        td({ children, ...props }) {
          return (
            <td
              className="border dark:border-white border-black px-4 py-2"
              {...props}
            >
              {children}
            </td>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="text-sm border-l-4 border-gray-200 pl-4 py-2 mb-2">
            {children}
          </blockquote>
        ),
        a({ children, href, ...props }) {
          return (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <a
                    href={href} //8x12
                    className="no-underline text-white font-normal ml-[-3] hover:text-primary text-[8px] sm:text-[11px] md:text-[11px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [{new URL(href || "example.com").hostname}]
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex items-center gap-2 bg-black p-1">
                  <SquareArrowOutUpRight className="h-4 w-4" />
                  <span>{href?.slice(0, 50) + "..."}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      }}
      className="text-sm"
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
