export type AIMessage = {
  role: "system" | "user" | "assistant" | "data";
  content: string;
  experimental_attachments: {
    name: string;
    contentType: string;
    url: string;
  }[];
};
