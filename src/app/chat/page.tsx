/* eslint-disable @next/next/no-img-element */
"use client";

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
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>

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
                      className="w-fit object-cover bg-black"
                    />
                  ))}
              </div>
              <p>{message.content}</p>
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
