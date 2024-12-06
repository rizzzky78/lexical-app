export type Model = {
  id: string;
  name: string;
  provider: string;
  providerId: string;
  status?: "online" | "disabled" | "experimental";
  capability?: ("tool" | "files" | "text" | "images")[];
};

export type LLModels = {
  id: string;
  name: string;
  provider:
    | "OpenAI"
    | "Groq"
    | "Google"
    | "Azure"
    | "Ollama"
    | "XAi"
    | ({} & string);
  providerId:
    | "openai"
    | "google"
    | "groq"
    | "azure"
    | "ollama"
    | "xai"
    | ({} & string);
  status?: "online" | "disabled" | "experimental";
  capability?: ("tool" | "files" | "text" | "images")[];
};
