import { LLModels } from "../model-types";

export const XaiModels: LLModels[] = [
  {
    id: "grok-beta",
    name: "Grok Beta",
    provider: "XAi",
    providerId: "xai",
    status: "online",
    capability: ["text", "tool"],
  },
  {
    id: "grok-vision-beta",
    name: "Grok Vision Beta",
    provider: "XAi",
    providerId: "xai",
    status: "online",
    capability: ["text", "tool", "images"],
  },
];
