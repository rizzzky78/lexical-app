import { LLModels } from "../model-types";

export const AnthropicModels: LLModels[] = [
  {
    id: "claude-3-5-sonnet-latest",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    providerId: "anthropic",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
] as const;
