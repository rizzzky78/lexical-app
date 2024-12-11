import { createStreamableUI } from "ai/rsc";
import { fireCrawlExtraction } from "./tool-firecrawl";
import { serperSearch } from "./tool-serper";
import { tavilySearch } from "./tool-tavily";

export const rootTools = {
  tavilySearch,
  serperSearch,
  fireCrawlExtraction,
};

type Chunk = {
  uiStream: ReturnType<typeof createStreamableUI>;
};

export const toolContainer = (model: string, chunk: Chunk) => {
  return {
    tavilySearch, serperSearch, fireCrawlExtraction
  }
};


export type FunctionToolsName = keyof ReturnType<typeof toolContainer>