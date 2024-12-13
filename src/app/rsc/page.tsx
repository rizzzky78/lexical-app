/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useCallback } from "react";
import { useActions, useUIState } from "ai/rsc";
import { AI } from "../action";
import { CoreUserMessage, FilePart, generateId, ImagePart } from "ai";
import { fileTypeFromBuffer } from "file-type";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Paperclip, Send, X } from "lucide-react";

interface FileWithPreview {
  file: File;
  id: string;
  preview?: string;
}

export default function ChatApp() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions<typeof AI>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "" && files.length === 0) return;

    // Add user message to UI
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: generateId(),
        component: (
          <div className="flex flex-col items-end">
            {input && (
              <div className="bg-blue-500 text-white p-2 rounded-lg mb-2 max-w-[70%]">
                {input}
              </div>
            )}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file) => (
                  <div key={file.id} className="w-16 h-16 relative">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                        <File className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
    ]);

    const payloadContent: (
      | ImagePart
      | FilePart
      | { type: "text"; text: string }
    )[] = [];

    // Add text content if present
    if (input.trim() !== "") {
      payloadContent.push({
        type: "text",
        text: input.trim(),
      });
    }

    // Add file content if present
    if (files.length > 0) {
      const fileContents = await Promise.all(
        files.map(async (file) => {
          const buffer = await file.file.arrayBuffer();
          const fileType = await fileTypeFromBuffer(buffer);
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

          if (file.file.type.startsWith("image/")) {
            return {
              type: "image",
              image: base64,
            } as ImagePart;
          } else {
            return {
              type: "file",
              data: base64,
              mimeType: fileType?.mime || file.file.type,
            } as FilePart;
          }
        })
      );

      payloadContent.push(...fileContents);

      console.log(JSON.stringify(payloadContent, null, 2));
    }

    const payloadMessages: CoreUserMessage = {
      role: "user",
      content: payloadContent,
    };

    try {
      const response = await submitMessage({
        message: payloadMessages,
        userId: "anonymous", // this must be from *Session* in getServerSession or in client side
        model: "none",
        messageType: "text_input",
        enableRelated: { scopeRelated: "last-message" },
      });

      setMessages((current) => [...current, response]);
    } catch (error) {
      console.error("Error submitting message:", error);
      // You might want to show an error message to the user here
    }

    setInput("");
    setFiles([]);
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files).map((file) => ({
          file,
          id: generateId(),
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        }));
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((idToRemove: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === idToRemove);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((file) => file.id !== idToRemove);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <ScrollArea className="flex-grow mb-4">
        {messages.map((message) => (
          <div key={message.id}>{message.component}</div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file) => (
              <div key={file.id} className="relative group">
                <div className="w-16 h-16 border rounded overflow-hidden">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <File className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                  {file.file.name}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow resize-none"
            rows={1}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            disabled={input.trim() === "" && files.length === 0}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
