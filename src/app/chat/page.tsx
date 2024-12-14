/* eslint-disable @next/next/no-img-element */
"use client";

import { MarkdownRenderer } from "@/components/atlas/markdown-renderer";
import { UserMessage } from "@/components/atlas/user-message";
import { Markdown } from "@/components/kratos/markdown";
import { useChat } from "ai/react";
import { useRef, useState } from "react";

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      api: "/api/chat/agents",
    });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-  3 md:space-y-4">
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "assistant" ? (
              <Markdown>{message.content}</Markdown>
            ) : message.role === "user" ? (
              <UserMessage message={message.content} />
            ) : (
              <p>{message.content}</p>
            )}

            <div>
              <div>
                {message.experimental_attachments
                  ?.filter((attachment) =>
                    attachment?.contentType?.startsWith("image/")
                  )
                  .map((attachment, index) => (
                    <img
                      key={`${message.id}-${index}`}
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-fit object-cover rounded-lg"
                    />
                  ))}
              </div>
              <div>
                {message.toolInvocations?.map((tool, idx) => (
                  <div key={idx} className="bg-gray-500 my-5">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(tool, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <input
          type="file"
          onChange={(event) => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          value={input}
          placeholder="Send message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
