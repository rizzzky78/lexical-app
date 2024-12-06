import { LLModels } from "../model-types";

export const OpenAiModels: LLModels[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
] as const;
