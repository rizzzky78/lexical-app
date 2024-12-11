"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { useActions, useUIState } from "ai/rsc";
import { AI } from "../action-mock";

export default function Home() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { generateResponse } = useActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInput("");
    setConversation((current: string | any[]) => [
      ...current,
      <div key={current.length}>{input}</div>,
    ]);
    const response = await generateResponse(input);
    setConversation((current: any) => [...current, response]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generative UI Assistant</h1>
      <div className="mb-4 p-4 border rounded-lg min-h-[300px]">
        {conversation.map(
          (
            message:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined,
            index: Key | null | undefined
          ) => (
            <div key={index} className="mb-2">
              {message}
            </div>
          )
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Ask a question..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
