import {
  experimental_createProviderRegistry as createProviderRegistry,
  Provider,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { xai } from "@ai-sdk/xai";
import { getEnv } from "@/lib/utils";

export const modelRegistry = createProviderRegistry({
  openai,
  anthropic,
  google,
  xai,
  groq: createGroq({
    apiKey: process.env.GROQ_API_KEY,
  }) as Provider,
});

export function getModel(model: string) {
  return modelRegistry.languageModel(model);
}

export function isProviderEnabled(providerId: string): boolean {
  switch (providerId) {
    case "openai":
      return !!getEnv("OPENAI_API_KEY");
    case "anthropic":
      return !!getEnv("ANTHROPIC_API_KEY");
    case "google":
      return !!getEnv("GOOGLE_GENERATIVE_AI_API_KEY");
    case "groq":
      return !!getEnv("GROQ_API_KEY");
    default:
      return false;
  }
}
