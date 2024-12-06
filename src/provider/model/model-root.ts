import { GoogleModels } from "./llm/google";
import { GroqModels } from "./llm/groq";
import { OpenAiModels } from "./llm/openai";
import { XaiModels } from "./llm/xai";
import { LLModels } from "./model-types";

export const modelsRoot: LLModels[] = [
  ...GroqModels,
  ...GoogleModels,
  ...OpenAiModels,
  ...XaiModels,
] as const;

export const multiModalModels = [
  "groq:llama-3.2-90b-vision-preview",
  "openai:gpt-4o",
  "openai:gpt-4o-mini",
  "anthropic:claude-3-5-sonnet-latest",
  "google:gemini-1.5-flash",
  "google:gemini-1.5-flash-8b",
  "google:gemini-1.5-pro",
  "google:gemini-exp-1114",
  "google:learnlm-1.5-pro-experimental",
  "azure:gpt-4o",
] as const;

export function createModelId(model: LLModels): string {
  return `${model.providerId}:${model.id}`;
}

export function getDefaultModelId(models: LLModels[]): string {
  if (!models.length) {
    throw new Error("No models available");
  }
  return createModelId(models[0]);
}
