import { LLModels } from "../model-types";

export const GoogleModels: LLModels[] = [
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    provider: "Google",
    providerId: "google",
    status: "online",
    capability: ["text"],
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    provider: "Google",
    providerId: "google",
    status: "online",
    capability: ["text", "tool"],
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    providerId: "google",
    status: "online",
    capability: ["text", "tool", "files"],
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    providerId: "google",
    status: "online",
    capability: ["text", "tool", "files", "images"],
  },
  {
    id: "gemini-exp-1121",
    name: "Gemini 1121",
    provider: "Google",
    providerId: "google",
    status: "experimental",
    capability: ["text", "tool", "files", "images"],
  },
  {
    id: "gemini-exp-1114",
    name: "Gemini 1114",
    provider: "Google",
    providerId: "google",
    status: "experimental",
    capability: ["text", "tool", "files", "images"],
  },
  {
    id: "learnlm-1.5-pro-experimental",
    name: "LearnLM Pro",
    provider: "Google",
    providerId: "google",
    status: "experimental",
    capability: ["text", "tool", "files", "images"],
  },
] as const;
