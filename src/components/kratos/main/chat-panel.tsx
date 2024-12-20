"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useCallback, FormEvent } from "react";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { File, Paperclip, Plus, Send, X } from "lucide-react";
import { AI } from "@/app/action";
import { useRouter } from "next/navigation";
import { UIComponent } from "@/lib/types/ai";

interface FileWithPreview {
  file: File;
  id: string;
  preview?: string;
}

interface ChatPanelProps {
  messages: Array<{ id: string; component: React.ReactNode }>;
  query?: string;
  chatid?: string;
}

export function ChatPanel({ messages, query, chatid }: ChatPanelProps) {
  const [input, setInput] = useState(query || "");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { submitMessage } = useActions<typeof AI>();

  const [, setUIState] = useUIState<typeof AI>();
  const [, setAIState] = useAIState<typeof AI>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "" && files.length === 0) return;

    const formData = new FormData();

    // Add text content if present
    if (input.trim() !== "") {
      formData.append("text", input.trim());
    }

    // Add file content if present
    files.forEach((file, index) => {
      formData.append(`file-${file.id}`, file.file);
    });

    const uiComponent: UIComponent = {
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
    };

    setUIState((currentUI) => [...currentUI, uiComponent]);

    const responseUi = await submitMessage({
      formData,
      userId: "not-set",
      model: "not-set",
      messageType: "text_input",
      classify: false,
      scope: {
        inquire: "global",
        related: "overall",
        taskManager: "global",
      },
    });

    setUIState((currentUI) => [...currentUI, responseUi]);

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

  const handleClear = () => {
    setUIState([]);
    setAIState({ messages: [], chatId: "" });
    setInput("");
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    router.push("/rsc");
    // revalidatePath('/chat')
  };

  if (messages.length > 0) {
    return (
      <div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center items-center mx-auto pointer-events-none">
        <Button
          type="button"
          variant="secondary"
          className="rounded-full bg-secondary/80 group transition-all hover:scale-105 pointer-events-auto"
          onClick={() => handleClear()}
        >
          <span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
            New
          </span>
          <Plus size={18} className="group-hover:rotate-90 transition-all" />
        </Button>
      </div>
    );
  }

  return (
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
          name="text_input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow resize-none"
          rows={1}
        />
        <input
          type="file"
          name="attachment"
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
  );
}
