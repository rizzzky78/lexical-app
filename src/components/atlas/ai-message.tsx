/* eslint-disable @next/next/no-img-element */
"use client";

import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { MemoizedReactMarkdown } from "./memoized-markdown";
import { CodeBlock } from "../ui/codeblock";
import { LinkWithTooltip } from "./link-with-tooltip";

export function BotMessage({ content }: { content: string }) {
  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    content || ""
  );

  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedData = preprocessLaTeX(content || "");

  // if (containsLaTeX) {
  //   return (
  //     <MemoizedReactMarkdown
  //       rehypePlugins={[
  //         [rehypeExternalLinks, { target: '_blank' }],
  //         [rehypeKatex]
  //       ]}
  //       remarkPlugins={[remarkGfm, remarkMath]}
  //       className="prose-sm prose-neutral prose-a:text-accent-foreground/50"
  //     >
  //       {processedData}
  //     </MemoizedReactMarkdown>
  //   )
  // }

  return (
    <MemoizedReactMarkdown
      rehypePlugins={[
        [rehypeExternalLinks, { target: "_blank" }],
        [rehypeKatex],
      ]}
      remarkPlugins={[remarkGfm, remarkMath]}
      className="prose-sm prose-neutral prose-a:text-accent-foreground/50"
      components={{
        // Add table components
        table({ node, children, ...props }) {
          return (
            <table className="border-collapse w-full my-4" {...props}>
              {children}
            </table>
          );
        },
        thead({ children, ...props }) {
          return (
            <thead
              className="dark:bg-slate-900 bg-slate-300 dark:text-black"
              {...props}
            >
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
        img({ src, alt, ...props }) {
          if (!src) return null;

          return (
            <div className="relative w-full my-4">
              {/* Main container with max height constraint */}
              <div className="max-h-[42vh] bg-white rounded-lg w-full flex items-center justify-center">
                {/* Image wrapper maintaining aspect ratio */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={src}
                    alt={alt || ""}
                    className="max-w-full py-4 max-h-[40vh] object-cover"
                    loading="lazy"
                    {...props}
                  />
                </div>
              </div>
              {/* Optional caption */}
              {alt && (
                <div className="p-2 text-sm text-center text-gray-500">
                  {alt}
                </div>
              )}
            </div>
          );
        },
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          );
        },
        a({ children, href, ...props }) {
          return (
            <LinkWithTooltip href={href || ""} {...props}>
              {children}
            </LinkWithTooltip>
          );
        },
      }}
    >
      {/* {content} */}
      {processedData}
    </MemoizedReactMarkdown>
  );
}

// Preprocess LaTeX equations to be rendered by KaTeX
// ref: https://github.com/remarkjs/react-markdown/issues/785
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};
