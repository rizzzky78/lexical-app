import { TavilySearchResponse } from "@/lib/types/tavily";
import { FC } from "react";

interface TavilySearchProps {
  content: TavilySearchResponse;
}

export const TavilySearch: FC<TavilySearchProps> = ({ content }) => {
  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto pt-20 px-4">
      <h2>Tavily Search Results</h2>
      <pre className="text-xs">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
};
